import React from 'react'

const zip = window.zip

export default class ZipAlter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inProgress: false,
    }

    this.startAlter=this.startAlter.bind(this)
  }

  finalize(zipWriter) {
    zipWriter.add('text.txt', new zip.TextReader('hello alteration'), () => {
      zipWriter.close(blob => {
        var blobURL = URL.createObjectURL(blob);
        var clickEvent;
        clickEvent = document.createEvent("MouseEvent");
        clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.ref.href = blobURL;
        this.ref.download = 'test.zip';
        this.ref.dispatchEvent(clickEvent);

        this.setState({ inProgress: false })
      });
    }, () => {})
  }

  startWriting(arr) {
    zip.createWriter(new zip.BlobWriter('application/zip'), zipWriter => {
      let index = 0;

      const readNext = (entry) => {
        zipWriter.add(entry.filename, new zip.BlobReader(entry.blob), () => {
          index ++
          if (index < arr.length) {
            readNext(arr[index])
          } else {
            this.finalize(zipWriter)
          }
        })
      }

      readNext(arr[index])
    }, console.log);
  }

  startAlter(ev) {
    ev.preventDefault()
    this.setState({ inProgress: true })
    const arr = []
    zip.createReader(new zip.HttpReader('/Archive.zip'), reader => {
        reader.getEntries(entries => {
          if (entries.length) {
            let count = entries.length
            entries.forEach(entry => {
              entry.getData(new zip.BlobWriter(), blob => {
                arr.push({
                  blob,
                  filename: entry.filename,
                });
                count --;
                if (count === 0) {
                  this.startWriting(arr);
                  reader.close()
                }
              })
            })
          } else {
            reader.close();
          }
        });


    }, console.log);

  }
  render() {
    return (
      <div>
        <a onClick={this.startAlter} href="#" disabled={this.state.inProgress}>Link to your archive</a>
        <a ref={ref => (this.ref = ref)} ></a>

      </div>
    )
  }
}

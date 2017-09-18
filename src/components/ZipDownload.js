import React from 'react'

const zip = window.zip

export default class ZipDownload extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entries: [],
    }

    this.startDownload = this.startDownload.bind(this)
  }
  startDownload() {

    const that = this
    // use a BlobReader to read the zip from a Blob object
    zip.createReader(new zip.HttpReader('/photos.zip'), function(reader) {

      // get all entries from the zip
      reader.getEntries(function(entries) {
        if (entries.length) {

          that.setState({ entries: entries.map(e => e.filename) })

          //// get first entry content as text
          //entries[0].getData(new zip.TextWriter(), function(text) {
          //  // text contains the entry data as a String
          //  console.log(text);
          //
          //  // close the zip reader
          //  reader.close(function() {
          //    // onclose callback
          //  });
          //
          //}, function(current, total) {
          //  // onprogress callback
          //});
          reader.close();
        }
      });
    }, function(error) {
      // onerror callback
      console.log(error)
    });
  }
  render() {
    return (
      <div>

        <ul>
          {this.state.entries.map(entry =>
            <li key={entry}>{entry}</li>
          )}
        </ul>

        <div>
          <label>
            <button onClick={this.startDownload} >Start</button>
          </label>
        </div>

      </div>
    )
  }
}

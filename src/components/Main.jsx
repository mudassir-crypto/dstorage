import React, { useRef, useState } from 'react'
import { convertBytes } from './helpers'
import moment from 'moment'

const Main = ({ uploadFile, files }) => {

  const [file, setfile] = useState([])
  const descriptionInput = useRef()

  const handleSubmit = (event) => {
    event.preventDefault()
    const description = descriptionInput.current.value 
    if(description === "") return 
    descriptionInput.current.value = null
    
    uploadFile(description, file)
  }

  const handleFileChange = (e) => {
    if(!e.target.files) return 

    setfile(e.target.files)
  }

  return (
    <div className="container-fluid mt-5 text-center">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1024px' }}>
          <div className="content">
            <p>&nbsp;</p>
            <h1>DStorage starter_code</h1>
            {/* Creating uploading card ... */}
            <p>&nbsp;</p>
            <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: '512px' }}>
              <h2 className="text-white text-monospace bg-dark"><b><ins>Share File</ins></b></h2>
                <form onSubmit={handleSubmit} >
                    <div className="form-group">
                      <br></br>
                      <input
                        id="fileDescription"
                        type="text"
                        ref={descriptionInput}
                        className="form-control text-monospace"
                        placeholder="description..."
                        required />
                    </div>
                  <input type="file" className="text-white text-monospace" name='file' onChange={handleFileChange}/>
                  <button type="submit" className="btn-primary btn-block"><b>Upload!</b></button>
                </form>
            </div>
            <p>&nbsp;</p>
              
            {/* table */}
            <table className="table-sm table-bordered text-monospace" style={{ width: '1000px', maxHeight: '450px'}}>
                <thead style={{ 'fontSize': '15px' }}>
                  <tr className="bg-dark text-white">
                    <th scope="col" style={{ width: '10px'}}>id</th>
                    <th scope="col" style={{ width: '200px'}}>name</th>
                    <th scope="col" style={{ width: '230px'}}>description</th>
                    <th scope="col" style={{ width: '120px'}}>type</th>
                    <th scope="col" style={{ width: '90px'}}>size</th>
                    <th scope="col" style={{ width: '90px'}}>date</th>
                    <th scope="col" style={{ width: '120px'}}>uploader/view</th>
                    <th scope="col" style={{ width: '120px'}}>hash/view/get</th>
                  </tr>
                </thead>
                <tbody>
                {files.map((item, idx) => (
                
                  <tr key={idx}>
                    <td>{item.fileId}</td>
                    <td>{item.fileName}</td>
                    <td>{item.fileDescription}</td>
                    <td>{item.fileType}</td>
                    <td>{convertBytes(item.fileSize)}</td>
                    <td>{moment.unix(item.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                    <td>
                      <a
                        href={"https://etherscan.io/address/" + item.uploader}
                        rel="noopener noreferrer"
                        target="_blank">
                        {item.uploader.substring(0,10)}...
                      </a>
                      </td>
                    <td>
                      <a 
                        href={`https://${item.fileHash}.ipfs.w3s.link/${item.fileName}`}
                      >
                        {item.fileHash}
                      </a>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
          </div>
        </main>
      </div>
    </div>
  );
}


export default Main;
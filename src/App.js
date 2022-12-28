import React, { useState, useEffect } from "react"
import Navbar from './components/Navbar'
import Main from "./components/Main"
import Web3 from "web3"
import DStorage from './abis/DStorage.json'
import { Web3Storage } from 'web3.storage'


const App = () => {
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileCount, setFileCount] = useState(0)
  const [dstorage, setDstorage] = useState({})
  const [files, setFiles] = useState([])
  
  useEffect(() => {
    
    const loadingWeb3 = async () => {
      await loadWeb3()
    } 

    const loadingBlockchainData = async() => {
      await loadBlockchainData()
    }

    loadingWeb3()
    loadingBlockchainData()
    
  }, [])
  
  
  const loadWeb3 = async () => {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      //console.log("accounts", accounts)
    } else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
      //console.log("window.web3", window.web3)
    } else {
      window.alert("Non-Ethereum Browser detected. Install Metamask")
    } 
  }

  const loadBlockchainData = async () => {
    setLoading(true)
    const web3 = window.web3 

    // load account
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    if(networkData){
      const dstorageCopy = new web3.eth.Contract(DStorage.abi, networkData.address)
      setDstorage(dstorageCopy)
      

      const filesCount = await dstorageCopy.methods.fileCount().call()
      
      console.log("fileCount: ", filesCount)
      setFileCount(filesCount)
    
      let arr = []
      for(let i = 1; i <= filesCount; i++){
        const file = await dstorageCopy.methods.getFiles(i).call()
        arr.push(file)
      }
      setFiles(arr)
      
    } else {
      window.alert("DStorage contract not deployed to detected network")
    }

    setLoading(false)
  }
  
  
  function makeStorageClient () {
    return new Web3Storage({ token: process.env.REACT_APP_TOKEN })
  }

  const uploadFile = async (description, file) => {
    console.log(description, file)
    setLoading(true)

    const client = makeStorageClient()
    try{
      const cid = await client.put(file)
      const url = `https://${cid}.ipfs.w3s.link/${file[0].name}`

      await dstorage.methods.uploadFile(cid, file[0].size, file[0].type, file[0].name,description).send({ from: account })
        .on("transactionHash", (hash) => {
          console.log(hash)
          setLoading(false)
          window.location.reload()
        })
        .on("error", (e) => {
          setLoading(false)
          window.alert("Error")
        })
      
    } catch(error){
      console.log(error)
      setLoading(false)
    }
  }
  console.log(files)
  return (
    <div>
      <Navbar account={account} />
      {loading
        ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        : (
          <Main
            files={files}
            uploadFile={uploadFile}
          />
        )
      }
    </div>
  )
}

export default App

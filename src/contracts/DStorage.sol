pragma solidity ^0.8.4;

contract DStorage {
  string public name = "DStorage";
  uint public fileCount = 0;

  mapping(uint => File) public files;

  // struct of file
  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }

  // event
  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName,
    string fileDescription,
    uint uploadTime,
    address payable uploader
  );

  constructor() public {

  }

  // upload function
  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public{

    require(bytes(_fileHash).length > 0);
    require(_fileSize > 0);
    require(bytes(_fileType).length > 0);
    require(bytes(_fileName).length > 0);
    require(bytes(_fileDescription).length > 0);
    require(msg.sender != address(0));

    fileCount++;

    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName,_fileDescription, block.timestamp, payable(msg.sender));

    // trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName,_fileDescription, block.timestamp, payable(msg.sender));
  }


  function getFiles(uint id) external view returns (File memory) {
    return files[id];
  }
}



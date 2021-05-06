
import React,{useRef} from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios"
import { Button } from "@material-ui/core";
function NewMeetingPopUp({ newMeetPop, setNewMeetPop,userToken,setMeetingData }) {
  const handleClose = () => setNewMeetPop(false);
  const handleSubmit=async ()=>{
      console.log(inputRef.current.value)
      const data= await axios.get("http://localhost:5001/hackathon-mta/europe-west1/api/createRoom",{params:{userToken,title:inputRef.current.value}})
      console.log(data.data);
      setMeetingData(data.data);
      handleClose();
  }
  const inputRef=useRef();
  return (
    <>
      <Modal show={newMeetPop} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>נא בחר שם לחדר</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <input ref={inputRef} type="text" placeholder="שם החדר" />
        </Modal.Body>
        <Modal.Footer>
        <Button className="popButtons" color="primary" variant="contained" onClick={handleSubmit}>
           פתח
          </Button>
          <Button className="popButtons" color="secondary" variant="contained" onClick={handleClose}>
            סגור
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NewMeetingPopUp;
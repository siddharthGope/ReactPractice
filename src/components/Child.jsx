import ReactDoom from "react-dom"

function Modal({children}) {

  return ReactDoom.createPortal (
    <div className="modal">
      {children}
    </div>,
    document.getElementById("modal-root")
  )
}

export default Modal
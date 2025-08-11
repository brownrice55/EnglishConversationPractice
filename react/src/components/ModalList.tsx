import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import type { Inputs } from "../types/inputs.type";

type ModalListProps = {
  listId: number;
  data: Map<number, Inputs>;
  onUpdate?: (key: number, listId: number, action: string) => void;
  isFirstTime: boolean;
};

export default function ModalList({
  listId,
  data,
  onUpdate,
  isFirstTime,
}: ModalListProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSetQuestion = (e: any) => {
    const key = parseInt(e.target.dataset.key);
    if (onUpdate) {
      onUpdate(key, listId, "edit");
    }
    setShow(false);
  };

  const handleDelete = (e: any) => {
    const key = parseInt(e.target.dataset.key);
    if (onUpdate) {
      onUpdate(key, listId, "delete");
    }
    setShow(false);
  };

  return (
    <>
      {isFirstTime ? (
        <Button variant="primary" onClick={handleShow} className="ms-3 my-1">
          質問の英文を追加する
        </Button>
      ) : (
        <>
          <Button onClick={handleShow}>変更する</Button>
          <Button className="ms-3" onClick={handleDelete}>
            削除する
          </Button>
        </>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>文章を選択してください</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {data.size &&
              [...data].map(([key, val]) => (
                <ListGroup.Item
                  key={key}
                  data-key={key}
                  onClick={handleSetQuestion}
                  style={{ cursor: "pointer" }}
                >
                  {val.question}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
}

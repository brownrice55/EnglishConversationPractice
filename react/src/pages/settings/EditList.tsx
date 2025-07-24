import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import HeaderSettings from "../../components/HeaderSettings";
import FormAddList from "../../components/FormAddList";
import type { InputsList } from "../../types/inputsList.type";
import { getListData } from "../../utils/common";

export default function EditList() {
  const originalListData = getListData();
  const [data, setData] = useState<Map<number, InputsList>>(originalListData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [keyNumber, setKeyNumber] = useState<number>(0);

  const handleEdit = (aKey: number) => {
    setIsEditing(true);
    setKeyNumber(aKey);
  };

  const handleDelete = (aKey: number) => {
    const newData = new Map(data);
    newData.delete(aKey);
    localStorage.setItem(
      "EnglishConversationPracticeList",
      JSON.stringify([...newData])
    );
    setData(newData);
  };

  const handleUpdate = (isEditing: boolean) => {
    if (!isEditing) {
      setIsEditing(false);
      const originalListData = getListData();
      setData(originalListData);
    }
  };

  return (
    <>
      <HeaderSettings />
      {!isEditing ? (
        <ListGroup>
          {[...data].map(([key, val]) => (
            <ListGroup.Item key={key}>
              <Row>
                <Col>{val.listname}</Col>
                <Col className="text-end">
                  <Button className="me-3" onClick={() => handleEdit(key)}>
                    編集
                  </Button>
                  <Button onClick={() => handleDelete(key)}>削除</Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <FormAddList keyNumber={keyNumber} onUpdate={handleUpdate} />
      )}
    </>
  );
}

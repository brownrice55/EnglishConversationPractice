import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Header from "./Header";
import FormAddAndEdit from "./FormAddAndEdit";
import type { Inputs } from "../types/inputs.type";
import { getData } from "../utils/common";

export default function Edit() {
  const originalData = getData();
  const [data, setData] = useState<Map<number, Inputs>>(originalData);
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
      "EnglishConversationPractice",
      JSON.stringify([...newData])
    );
    setData(newData);
  };

  const handleUpdate = (isEditing: boolean) => {
    if (!isEditing) {
      setIsEditing(false);
      const originalData = getData();
      setData(originalData);
    }
  };

  return (
    <>
      <Header
        title="編集・削除"
        description="編集・削除のページです"
        keywords="英語,英会話"
      />
      {!isEditing ? (
        <ListGroup>
          {[...data].map(([key, val]) => (
            <ListGroup.Item key={key}>
              <Row>
                <Col>{val.question}</Col>
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
        <FormAddAndEdit
          keyNumber={keyNumber}
          isEditing={true}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}

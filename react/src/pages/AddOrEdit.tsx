import { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Add from "../components/Add";
import Edit from "../components/Edit";
import { DoesDataExistContext } from "../contexts/context";

type PageProps = {
  activeKey: string;
};
export default function AddOrEdit({ activeKey }: PageProps) {
  const context = useContext(DoesDataExistContext);
  if (!context) {
    throw new Error("error");
  }
  const { doesDataExist } = context;

  return (
    <>
      {doesDataExist ? (
        <Nav variant="tabs" defaultActiveKey={activeKey}>
          <Nav.Item>
            <Nav.Link href="/add">新規登録</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/edit">編集・削除</Nav.Link>
          </Nav.Item>
        </Nav>
      ) : (
        ""
      )}
      <Container className="py-4">
        {activeKey == "/add" ? <Add /> : <Edit />}
      </Container>
    </>
  );
}

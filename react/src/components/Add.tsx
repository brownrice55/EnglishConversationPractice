import FormForAddAndEdit from "./FormForAddAndEdit";
import Header from "./Header";

export default function Add() {
  return (
    <>
      <Header
        title="新規登録"
        description="練習のページです"
        keywords="英語,英語 勉強"
      />
      <FormForAddAndEdit />
    </>
  );
}

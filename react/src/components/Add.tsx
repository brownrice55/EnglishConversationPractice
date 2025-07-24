import FormAddAndEdit from "./FormAddAndEdit";
import Header from "./Header";

export default function Add() {
  return (
    <>
      <Header
        title="新規登録"
        description="新規登録のページです"
        keywords="英語,英会話"
      />
      <FormAddAndEdit keyNumber={0} isEditing={false} onUpdate={() => {}} />
    </>
  );
}

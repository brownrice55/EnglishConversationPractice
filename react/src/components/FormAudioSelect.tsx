import Form from "react-bootstrap/Form";

type FormAudioProps = {
  label: string;
  name: string;
  indexNo: number;
  value: string;
  onUpdate: (value: string, indexNo: number) => void;
};

export default function FormAudioSelect({
  label,
  name,
  indexNo,
  value,
  onUpdate,
}: FormAudioProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    indexNo: number
  ) => {
    onUpdate(e.target.value, indexNo);
  };

  return (
    <>
      <Form.Group className="my-5">
        <Form.Label htmlFor={name}>
          <p>{label}</p>
        </Form.Label>
        <Form.Select
          aria-label={name}
          id={name}
          defaultValue={value}
          onChange={(e) => handleChange(e, indexNo)}
        >
          <option value="en-GB">英語（イギリス）</option>
          <option value="en-US">英語（アメリカ）</option>
          <option value="en-AU">英語（オーストラリア）</option>
          <option value="en-CA">英語（カナダ）</option>
          <option value="en-IN">英語（インド）</option>
        </Form.Select>
      </Form.Group>
    </>
  );
}

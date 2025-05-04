import { Modal, Button } from "antd";
import { ShieldBoldDuotone } from "solar-icons";

const OkModal = ({ open, onOk, onCancel, text }) => {
  return (
    <Modal
      width="420px"
      //title="Анхааруулга"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
    >
      <div className="text-main flex justify-center pt-6">
        <ShieldBoldDuotone width={60} height={60} />
      </div>
      <p className="pt-4 pb-2 text-center leading-5">{text}</p>
      <div className="flex gap-3 justify-end mt-6">
        <Button
          onClick={onOk}
          className="the-btn"
          htmlType="submit"
          type="primary"
        >
          Ойлголоо
        </Button>
      </div>
    </Modal>
  );
};

export default OkModal;

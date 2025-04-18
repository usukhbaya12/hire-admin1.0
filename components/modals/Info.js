import { Modal, Button } from "antd";
import { ShieldBoldDuotone } from "solar-icons";

const InfoModal = ({ open, onOk, onCancel, text }) => {
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
        <Button className="back-btn" onClick={onCancel}>
          Буцах
        </Button>
        <Button
          onClick={onOk}
          className="the-btn"
          htmlType="submit"
          type="primary"
        >
          Тийм
        </Button>
      </div>
    </Modal>
  );
};

export default InfoModal;

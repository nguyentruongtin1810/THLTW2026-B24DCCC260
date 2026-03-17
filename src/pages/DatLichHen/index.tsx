import React from 'react';
import { Result, Button } from 'antd';
import { history } from 'umi';

const DatLichHen: React.FC = () => {
  return (
    <Result
      status="404"
      title="Chọn một chức năng"
      subTitle="Vui lòng chọn một trong các chức năng bên trái menu"
      extra={
        <Button type="primary" onClick={() => history.push('/dat-lich-hen/dat-lich')}>
          Đặt lịch hẹn
        </Button>
      }
    />
  );
};

export default DatLichHen;

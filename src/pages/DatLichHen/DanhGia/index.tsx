import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Modal, Input, Rate, message } from 'antd';
import type { DanhGia } from '@/models/datlichhen';
import {
  getDanhGias,
  getNhanVienById,
  getLichHenById,
  updateDanhGia,
} from '@/services/datlichhen';

const DanhGiaPage: React.FC = () => {
  const [danhGias, setDanhGias] = useState<DanhGia[]>([]);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [activeRating, setActiveRating] = useState<DanhGia | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadData = () => {
    setDanhGias(getDanhGias());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReply = (rating: DanhGia) => {
    setActiveRating(rating);
    setReplyText(rating.phanHoi || '');
    setReplyModalVisible(true);
  };

  const handleSubmitReply = () => {
    if (!activeRating) return;
    if (!replyText.trim()) {
      message.error('Vui lòng nhập phản hồi');
      return;
    }
    updateDanhGia(activeRating.id, { phanHoi: replyText, ngayPhanHoi: new Date().toISOString().slice(0, 10) });
    loadData();
    setReplyModalVisible(false);
    message.success('Phản hồi đã được lưu');
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'lichHenId',
      key: 'khachHang',
      render: (lichHenId: string) => getLichHenById(lichHenId)?.khachHang || 'N/A',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'nhanVienId',
      key: 'nhanVien',
      render: (nhanVienId: string) => getNhanVienById(nhanVienId)?.ten || 'N/A',
    },
    {
      title: 'Ngày đánh giá',
      dataIndex: 'ngay',
      key: 'ngay',
    },
    {
      title: 'Sao',
      dataIndex: 'soSao',
      key: 'soSao',
      render: (value: number) => <Rate disabled value={value} />,
    },
    {
      title: 'Bình luận',
      dataIndex: 'binhLuan',
      key: 'binhLuan',
      render: (value: string) => value || '-',
    },
    {
      title: 'Phản hồi',
      dataIndex: 'phanHoi',
      key: 'phanHoi',
      render: (value: string) => value || '-',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: DanhGia) => (
        <Button type="link" onClick={() => handleOpenReply(record)}>
          {record.phanHoi ? 'Sửa phản hồi' : 'Phản hồi'}
        </Button>
      ),
    },
  ];

  return (
    <Card title="Đánh giá" bordered={false}>
      <Table columns={columns} dataSource={danhGias} rowKey="id" />

      <Modal
        title="Phản hồi đánh giá"
        visible={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={handleSubmitReply}
      >
        <Input.TextArea
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Nhập phản hồi của nhân viên..."
        />
      </Modal>
    </Card>
  );
};

export default DanhGiaPage;

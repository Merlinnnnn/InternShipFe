import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Box } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import apiService from '@/app/untils/api';
import { useRouter } from 'next/navigation';

interface HistoryDialogProps {
    open: boolean;
    onClose: () => void;
    id: number;
}

interface HistoryDataItem {
    id: string;
    authorName: string;
    authorType: string;
    createdAt: string;
}

const HistoryDialog: React.FC<HistoryDialogProps> = ({ open, onClose, id }) => {
    const [historyData, setHistoryData] = useState<HistoryDataItem[]>([]);
    const router = useRouter();

    const fetchData = async () => {
        try {
            const res = await apiService.get(`/audit-log/${id}`);
            const data = res.data as HistoryDataItem[];
            setHistoryData(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching history data:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const handleViewClick = (historyId: string) => {
        console.log('ID:', id);
        router.push(`/history?id=${historyId}`);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: '15px'}}>
                <DialogTitle>Lịch sử</DialogTitle>
                <IconButton onClick={()=>{onClose()}}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <DialogContent>
                <Table>
                    <TableHead sx={{ background: '#f4f6f8' }}>
                        <TableRow>
                            <TableCell>Action</TableCell>
                            <TableCell>Editor</TableCell>
                            <TableCell>Department Name</TableCell>
                            <TableCell>Date created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historyData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <IconButton onClick={() => handleViewClick(item.id)}>
                                        <VisibilityOutlinedIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>{item.authorName}</TableCell>
                                <TableCell>{item.authorType}</TableCell>
                                <TableCell>{item.createdAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>

        </Dialog>
    );
};

export default HistoryDialog;

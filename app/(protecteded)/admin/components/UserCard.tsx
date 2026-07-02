import { Card, CardActions, CardContent, Divider, Button, Stack, Typography, Chip } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import styles from '../admin.module.css';

type User = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  isBlocked?: boolean;
};

export default function UserCard({ user, isSelf, toggleAction, deleteAction }: { user: User; isSelf: boolean; toggleAction: any; deleteAction: any }) {
  return (
    <Card className={styles.cardRoot} variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center' }} spacing={1}>
            <Typography variant="subtitle1" component="h2">
              {user.name || user.email}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {user.role}
          </Typography>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center' }} spacing={1}>
            <Chip label={user.isBlocked ? 'Blocked' : 'Active'} color={user.isBlocked ? 'error' : 'success'} size="small" className={styles.statusChip} />
            {isSelf ? <Chip label="Current admin" variant="outlined" size="small" /> : null}
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions className={styles.cardActions}>
        <form action={toggleAction} className={styles.actionForm}>
          <input type="hidden" name="email" value={user.email} />
          <Button type="submit" color={user.isBlocked ? 'success' : 'warning'} variant="outlined" startIcon={<BlockIcon />} disabled={isSelf}>
            {user.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </form>
        <form action={deleteAction} className={styles.actionForm}>
          <input type="hidden" name="email" value={user.email} />
          <Button type="submit" color="error" variant="outlined" startIcon={<DeleteOutlineOutlined />} disabled={isSelf}>
            Delete
          </Button>
        </form>
      </CardActions>
    </Card>
  );
}

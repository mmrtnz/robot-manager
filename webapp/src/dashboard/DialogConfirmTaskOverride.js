import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const DialogConfirmTaskOverride = props => {
  const {
    botName,
    recentAssignee,
    recentTaskType,
    onConfirm,
    onClose,
    ...dialogProps
  } = props;
  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        Override Current Task
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <>
            <strong>{botName}</strong> was set to&nbsp;
            <strong>{recentTaskType}</strong> by&nbsp;
            <strong>{recentAssignee}</strong>.<br/>
            Do you want to stop this task?
          </>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>
          Yes
        </Button>
        <Button onClick={onClose} autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirmTaskOverride;

import { DialogContent, DialogActions, Dialog, DialogTitle, IconButton, Slide } from '@mui/material'
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { TransitionProps } from '@mui/material/transitions';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const TransitionLeft = React.forwardRef(function Transition(props: TransitionProps & { children: React.ReactElement<any, any>; }, ref: React.Ref<unknown>) {
  return <Slide direction={"left"} ref={ref} {...props} />;
});

const TransitionUp = React.forwardRef(function Transition(props: TransitionProps & { children: React.ReactElement<any, any>; }, ref: React.Ref<unknown>) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});

export interface ICustomDialog {
  children: React.ReactNode;
  actions?: React.ReactNode;
  title: string;
  openDialog: boolean;
  bottomRight?: boolean;
  onSave?: (val: any) => any;
  onClose: (val: boolean) => any;
  maxWidth: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
  fullWidth?: boolean;
  customProp?: string
  fullScreen?: boolean
}

const CustomDialog = (props: ICustomDialog) => {
  const { children, openDialog, title, actions, bottomRight, onClose, maxWidth, fullWidth, fullScreen /* onSave */ } = props;
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose(false)
  };

  React.useEffect(() => {

    setOpen(openDialog);
  }, [openDialog])

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullScreen={fullScreen}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        sx={bottomRight ? {
          "& .MuiDialog-container": {
            justifyContent: "flex-end",
            alignItems: "flex-end"
          }
        } : {}}
        PaperProps={bottomRight ? {
          sx: {
            m: 0,
            top: 0,
            right: 0
          }
        } : {}}
        TransitionComponent={bottomRight ? TransitionLeft : TransitionUp}
        // TransitionProps={{ customProp }}
        keepMounted
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {children}
        </DialogContent>
        {actions && (
          <DialogActions>
            {actions}
          </DialogActions>
        )}
      </BootstrapDialog>
    </div>
  )
}

export default CustomDialog

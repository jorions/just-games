import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core'

// When passed as the 'TransitionComponent' prop into <Dialog> it must be able to hold a ref,
// but pure functional components are stateless and thus cannot hold a ref.
// So instead it must be a class.
class Transition extends PureComponent {
  render() {
    return <Slide direction="up" {...this.props} />
  }
}

const Modal = ({ isOpen, title, content, buttons: _buttons, onClose: _onClose, onOKClick }) => {
  const buttons = onOKClick ? [..._buttons, { value: 'OK', onClick: onOKClick }] : _buttons
  const onClose = onOKClick || _onClose

  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>
          {typeof content === 'string' ? (
            <DialogContentText id="alert-dialog-slide-description">{content}</DialogContentText>
          ) : (
            content
          )}
        </DialogContent>
        <DialogActions>
          {buttons.map(
            ({ component, props = {}, value, color = 'primary', className = '', onClick }) =>
              component || (
                <Button
                  variant="text"
                  color={color}
                  key={value}
                  value={value}
                  className={className}
                  onClick={onClick}
                  {...props}
                >
                  {value}
                </Button>
              ),
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.node,
      value: PropTypes.string,
      color: PropTypes.string,
      className: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
  onOKClick: PropTypes.func,
  onClose: PropTypes.func,
}

Modal.defaultProps = {
  content: null,
  buttons: [],
  onOKClick: null,
  onClose: null,
}

export default Modal

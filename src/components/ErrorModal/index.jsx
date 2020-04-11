import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'

export const buildErrorProps = ({ isOpen, brokeWhile, onOKClick }) => ({
  isOpen,
  title: 'This is awkward...',
  content: `Something broke while you were ${brokeWhile}. Please try again.`,
  onOKClick,
})

const ErrorModal = ({ options, onOKClick }) =>
  options.map(({ isOpen, title, content, onOKClick: customOnOKClick, buttons }) => (
    <Modal
      key={`${title}_${content}`}
      isOpen={isOpen}
      title={title}
      content={content}
      onOKClick={buttons ? null : customOnOKClick || onOKClick}
      buttons={buttons}
    />
  ))

ErrorModal.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      onOKClick: PropTypes.func,
      buttons: PropTypes.arrayOf(
        PropTypes.shape({
          component: PropTypes.node,
          value: PropTypes.string,
          color: PropTypes.string,
          className: PropTypes.string,
          onClick: PropTypes.func,
        }),
      ),
    }).isRequired,
  ).isRequired,
  onOKClick: PropTypes.func,
}

export default ErrorModal

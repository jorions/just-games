import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import { Redirect } from 'react-router-dom'

import { gameNames } from 'shared/games'

import Modal from 'components/Modal'
import ErrorModal, { buildErrorProps } from 'components/ErrorModal'
import Spinner from 'components/Spinner'
import Header from 'components/Header'
import PasswordInput from 'components/PasswordInput'

import CAH from './CAH'

import styles from './styles.css'

class Game extends PureComponent {
  state = { password: '', lastSubmittedPassword: null, deletingGame: false }

  componentDidMount() {
    const { fetchGame } = this.props
    fetchGame()
  }

  componentWillUnmount() {
    const { reset } = this.props
    reset()
    // TODO: Submit request to mark user as inactive in game
  }

  handlePasswordChange = ({ target: { value } }) => {
    this.setState({ password: value })
  }

  handlePasswordSubmit = () => {
    const { clearErrors, fetchGame } = this.props
    const { password } = this.state
    this.setState({ lastSubmittedPassword: password || '' }, () => {
      clearErrors()
      fetchGame(password, () => this.setState({ password: '', lastSubmittedPassword: null }))
    })
  }

  handleDeleteClick = () => {
    this.setState({ deletingGame: true })
  }

  handleCancelDeleteClick = () => {
    this.setState({ deletingGame: false })
  }

  renderErrorModal() {
    const {
      gameNotFound,
      invalidPassword,
      playerInGame,
      pollingError,
      deleteGameError,
      fetchGameError,
      gameEnded,
      submitActionError,
      clearErrors,
      fetchGame,
      history,
    } = this.props
    const { password, lastSubmittedPassword } = this.state

    return (
      <ErrorModal
        options={[
          {
            isOpen: gameNotFound,
            title: 'Game not found',
            content: "Can't find that one - sorry!",
            onOKClick: () => history.push('/'),
          },
          {
            isOpen: invalidPassword,
            title:
              lastSubmittedPassword === null
                ? 'This game is password-protected'
                : 'Wrong password - try again',
            content: (
              <PasswordInput label={null} value={password} onChange={this.handlePasswordChange} />
            ),
            buttons: [
              {
                value: 'Go Back',
                color: 'secondary',
                onClick: () => history.push('/'),
                className: styles.goBackButton,
              },
              {
                value: 'OK',
                color: 'primary',
                onClick: this.handlePasswordSubmit,
              },
            ],
          },
          // TODO: Add "Go Back" button, change other button to "Try again"
          {
            isOpen: playerInGame,
            title: "You're already in a game",
            content: "Wait a few seconds and you'll be cleared out of your old game",
            onOKClick: () => {
              clearErrors()
              fetchGame()
            },
          },
          {
            isOpen: pollingError,
            title: 'Pwomp',
            content: 'The connection was lost. Please refresh the page.',
          },
          {
            isOpen: deleteGameError,
            title: 'Woops',
            content:
              'Something broke while trying to end the game. If everyone leaves the game it will automatically end.',
            onOKClick: () => {
              clearErrors()
              fetchGame()
            },
          },
          {
            isOpen: gameEnded,
            title: 'This game has ended',
            content: 'Click OK to go back to the list of games',
            onOKClick: () => history.push('/'),
          },
          buildErrorProps({
            isOpen: submitActionError,
            brokeWhile: 'submitting your move',
            onOKClick: () => {
              clearErrors()
              fetchGame()
            },
          }),
          buildErrorProps({
            isOpen: fetchGameError,
            brokeWhile: 'loading this game',
          }),
        ]}
        onOKClick={() => fetchGame()}
      />
    )
  }

  renderGame() {
    const { type, submitAction } = this.props

    switch (type) {
      case gameNames.CAH:
        return <CAH submitAction={submitAction} />
      default:
        return null
    }
  }

  render() {
    const {
      fetchGameLoading,
      deleteGameLoading,
      deleteGameSuccess,
      name,
      isOwner,
      className,
      deleteGame,
    } = this.props
    const { deletingGame } = this.state

    if (fetchGameLoading)
      return (
        <div className="center mt4 pt4">
          <Spinner size={120} />
        </div>
      )

    if (deleteGameSuccess) return <Redirect to="/" />

    return (
      <>
        {this.renderErrorModal()}
        <Modal
          isOpen={deletingGame}
          title="Are you sure you want to end the game?"
          buttons={
            deleteGameLoading
              ? [
                  {
                    component: (
                      <div className="center w-100" key="loading">
                        <Spinner size={36} />
                      </div>
                    ),
                  },
                ]
              : [
                  {
                    value: 'No',
                    color: 'secondary',
                    onClick: this.handleCancelDeleteClick,
                    className: styles.noButton,
                  },
                  { value: 'OK', onClick: deleteGame },
                ]
          }
        />
        <div className={className}>
          {isOwner ? (
            <>
              <div styleName="headerSpacer" />
              <div styleName="header">
                <Header title={name} />
              </div>
              <div styleName="deleteContainer">
                <div styleName="delete">
                  <IconButton onClick={this.handleDeleteClick}>
                    <DeleteIcon classes={{ root: styles.deleteIcon }} />
                  </IconButton>
                </div>
              </div>
            </>
          ) : (
            <Header title={name} />
          )}
        </div>
        {this.renderGame()}
      </>
    )
  }
}

Game.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  fetchGameLoading: PropTypes.bool.isRequired,
  fetchGameError: PropTypes.bool.isRequired,
  deleteGameLoading: PropTypes.bool.isRequired,
  deleteGameError: PropTypes.bool.isRequired,
  deleteGameSuccess: PropTypes.bool.isRequired,
  gameNotFound: PropTypes.bool.isRequired,
  invalidPassword: PropTypes.bool.isRequired,
  playerInGame: PropTypes.bool.isRequired,
  pollingError: PropTypes.bool.isRequired,
  gameEnded: PropTypes.bool.isRequired,
  submitActionError: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  fetchGame: PropTypes.func.isRequired,
  deleteGame: PropTypes.func.isRequired,
  submitAction: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

Game.defaultProps = {
  type: '',
}

export default Game

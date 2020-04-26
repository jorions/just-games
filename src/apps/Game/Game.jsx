import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import HelpIcon from '@material-ui/icons/HelpOutline'
import { Redirect } from '@reach/router'

import { gameNames } from 'shared/games'

import Modal from 'components/Modal'
import ErrorModal, { buildErrorProps } from 'components/ErrorModal'
import Spinner from 'components/Spinner'
import Header from 'components/Header'
import PasswordInput from 'components/PasswordInput'

import CAH from './CAH'

import styles from './styles.css'

class Game extends PureComponent {
  state = {
    password: '',
    lastSubmittedPassword: null,
    deletingGame: false,
    showInstructions: false,
  }

  componentDidMount() {
    const { fetchGame } = this.props
    fetchGame()
  }

  componentWillUnmount() {
    const { reset } = this.props
    reset()
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

  handleInstructionsClick = () => {
    this.setState({ showInstructions: true })
  }

  handleCloseInstructionsClick = () => {
    this.setState({ showInstructions: false })
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
      navigate,
    } = this.props
    const { password, lastSubmittedPassword } = this.state

    return (
      <ErrorModal
        options={[
          {
            isOpen: gameNotFound,
            title: 'Game not found',
            content: "Can't find that one - sorry!",
            onOKClick: () => navigate('/'),
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
                onClick: () => navigate('/'),
                className: styles.goBackButton,
              },
              {
                value: 'OK',
                color: 'primary',
                onClick: this.handlePasswordSubmit,
              },
            ],
          },
          {
            isOpen: playerInGame,
            title: "You're already in a game",
            content: "Wait a few seconds and you'll be cleared out of your old game",
            buttons: [
              {
                value: 'Go Back',
                color: 'secondary',
                onClick: () => navigate('/'),
                className: styles.goBackButton,
              },
              {
                value: 'Try Again',
                color: 'primary',
                onClick: () => {
                  clearErrors()
                  fetchGame()
                },
              },
            ],
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
            onOKClick: () => navigate('/'),
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

  renderInstructions() {
    const { type } = this.props

    switch (type) {
      case gameNames.CAH:
        return (
          <div>
            <div className="mb2">To quote the official page:</div>
            <div className="mb2">
              "Each round, one player asks a question from a black card, and everyone else answers
              with their funniest white card."
            </div>
            <div className="mb2">
              The player asking the question is the "Czar". The Czar changes at the end of each
              round.
            </div>
            <div className="mb2">
              When players pick their answer, it will require at least 1 card, but some black cards
              call for multiple white cards.
            </div>
            <div className="mb2">
              Simply click a white card to select it. Once you select all of the necessary cards,
              click "Submit Your Card" at the top of the page.
            </div>
            <div className="mb2">
              Once all players have submitted their cards, the Czar will pick their favorite answer.
            </div>
            <div className="mb2">
              Simply click the cards to select them, then click "Submit Your Choice" at the top of
              the page.
            </div>
          </div>
        )
      default:
        return 'Instructions unavailable'
    }
  }

  renderInteractionModal() {
    const { deleteGameLoading, deleteGame } = this.props
    const { deletingGame, showInstructions } = this.state
    return (
      <>
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
        <Modal
          isOpen={showInstructions}
          title="How To Play"
          content={this.renderInstructions()}
          onOKClick={this.handleCloseInstructionsClick}
        />
      </>
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
    const { fetchGameLoading, deleteGameSuccess, name, isOwner, className } = this.props

    if (fetchGameLoading)
      return (
        <div className="center mt4 pt4">
          <Spinner size={120} />
        </div>
      )

    if (deleteGameSuccess) return <Redirect to="/" noThrow />

    return (
      <>
        {this.renderErrorModal()}
        {this.renderInteractionModal()}
        <div className={className}>
          <div styleName="buttonContainer">
            <div styleName="delete">
              <IconButton onClick={this.handleInstructionsClick}>
                <HelpIcon classes={{ root: styles.icon }} />
              </IconButton>
            </div>
          </div>
          <div styleName="header">
            <Header title={name} />
          </div>
          <div styleName="buttonContainer">
            {isOwner && (
              <div styleName="delete">
                <IconButton onClick={this.handleDeleteClick}>
                  <DeleteIcon classes={{ root: styles.icon }} />
                </IconButton>
              </div>
            )}
          </div>
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
  navigate: PropTypes.func.isRequired,
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

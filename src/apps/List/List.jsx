import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from '@reach/router'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'

import { game } from 'routes'
import { gameNames } from 'shared/games'
import { shortStringCharLimit } from 'shared/validations'

import TextInput from 'components/TextInput'
import PasswordInput from 'components/PasswordInput'
import Dropdown from 'components/Dropdown'
import ErrorModal, { buildErrorProps } from 'components/ErrorModal'
import Header from 'components/Header'
import Spinner from 'components/Spinner'
import KeyPressListener from 'components/KeyPressListener'

import './styles.css'

class List extends PureComponent {
  state = { gameName: '', gameType: gameNames.CAH, password: '' }

  componentDidMount() {
    const { fetchGames } = this.props
    fetchGames()
  }

  componentWillUnmount() {
    const { reset } = this.props
    reset()
  }

  handleChange = ({ target: { name, value } }) => {
    if (value.length <= shortStringCharLimit) this.setState({ [name]: value })
  }

  handleTypeChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  handleCreateGame = () => {
    const { createGame } = this.props
    const { gameName, gameType, password } = this.state
    if (!gameName || !gameType) return
    createGame({ gameName, gameType, password })
  }

  renderErrorModal() {
    const { fetchGamesError, createGameError, playerInGame, clearErrors, fetchGames } = this.props
    return (
      <ErrorModal
        options={[
          {
            isOpen: playerInGame,
            title: "You're already in a game",
            content: "Wait a few seconds and you'll be cleared out of your old game",
            onOKClick: clearErrors,
          },
          buildErrorProps({
            isOpen: createGameError,
            brokeWhile: 'creating your game',
            onOKClick: clearErrors,
          }),
          buildErrorProps({
            isOpen: fetchGamesError,
            brokeWhile: 'loading games',
            onOKClick: () => fetchGames(), // Nest to avoid passing click event to fetchGames
          }),
        ]}
      />
    )
  }

  render() {
    const { games, fetchGamesLoading, newGameId } = this.props
    const { gameName, gameType, password } = this.state

    if (newGameId) return <Redirect to={game(newGameId)} noThrow />

    return (
      <div>
        {this.renderErrorModal()}
        <Header title="All Games" />
        <KeyPressListener onKeyPress={this.handleCreateGame} enterKey />
        <div styleName="createGame">
          <TextInput
            name="gameName"
            id="gameName"
            value={gameName}
            placeholder="Game Name"
            label="Game Name"
            onChange={this.handleChange}
            fullWidth
          />
          <PasswordInput
            name="password"
            value={password}
            placeholder="Password (optional)"
            label="Password (optional)"
            onChange={this.handleChange}
          />
          <Dropdown
            name="gameType"
            id="gameType"
            value={gameType}
            label="Game Type"
            onChange={this.handleTypeChange}
            options={[{ value: gameNames.CAH, display: 'Cards Against Humanity' }]}
          />
          <div>
            <Button
              color="secondary"
              styleName="submitCreateGame"
              variant="contained"
              disabled={!gameName || !gameType}
              fullWidth
              onClick={this.handleCreateGame}
            >
              Create game
            </Button>
          </div>
        </div>
        <div className="flex-centered">
          {fetchGamesLoading ? (
            <Spinner size={120} />
          ) : (
            <div styleName="list">
              {games.map(({ id, name, type, owner, passwordRequired, players }) => (
                <div key={id}>
                  <Card>
                    <CardActionArea component={Link} to={game(id)} styleName="card">
                      <Typography variant="h6" className="w-100 inline-block ellipsis">
                        {name}
                      </Typography>
                      <Typography variant="caption" className="w-100 inline-block">
                        {type}
                      </Typography>
                      <Typography variant="caption" className="w-100 inline-block">
                        Owner: {owner}
                      </Typography>
                      <div className="w-100 ellipsis">
                        <Typography variant="caption" color="textSecondary">
                          {players.join(', ')}
                        </Typography>
                      </div>
                      <div styleName="passwordNote">
                        {passwordRequired ? (
                          <Typography variant="caption" color="secondary">
                            Password required
                            <LockIcon color="secondary" />
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="primary">
                            Open to all
                            <LockOpenIcon color="primary" />
                          </Typography>
                        )}
                      </div>
                    </CardActionArea>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}

List.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      passwordRequired: PropTypes.bool.isRequired,
      players: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
  fetchGamesLoading: PropTypes.bool.isRequired,
  fetchGamesError: PropTypes.bool.isRequired,
  newGameId: PropTypes.string,
  createGameError: PropTypes.bool.isRequired,
  playerInGame: PropTypes.bool.isRequired,
  fetchGames: PropTypes.func.isRequired,
  createGame: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

List.defaultProps = {
  newGameId: null,
}

export default List

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MCard from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { gameNames, games } from 'shared/games'
import style from 'lib/style'
import addOrRemoveFromArr from 'lib/addOrRemoveFromArr'

import Spinner from 'components/Spinner'
import Card from './Card'

import './styles.css'

const {
  statuses: { PICKING_WINNER, PLAYERS_SUBMITTING, WINNER },
  actions: { SUBMIT_CARDS, PICK_WINNER },
} = games[gameNames.CAH]

class CAH extends PureComponent {
  state = { selected: [], winner: null }

  handleSubmitOwnCardsClick = () => {
    const { yourCards, submitAction } = this.props
    const { selected } = this.state

    const cardTexts = yourCards.filter((text, idx) => selected.includes(idx))

    submitAction(SUBMIT_CARDS, cardTexts, () => this.setState({ selected: [] }))
  }

  handleOwnCardClick = idx => {
    const { prompt } = this.props
    const { selected } = this.state

    const isAlreadySelected = selected.includes(idx)
    if (isAlreadySelected) this.setState({ selected: addOrRemoveFromArr(selected, idx) })
    else if (prompt.pick > selected.length) this.setState({ selected: [...selected, idx] })
    else if (prompt.pick === 1) this.setState({ selected: isAlreadySelected ? [] : [idx] })
  }

  handleSubmitWinnerClick = () => {
    const { submitAction } = this.props
    const { winner } = this.state
    submitAction(PICK_WINNER, winner, () => this.setState({ winner: null }))
  }

  handleWinnerClick = idx => {
    this.setState(({ winner }) => ({ winner: winner === idx ? null : idx }))
  }

  renderStatusText() {
    const { prompt, status, players, isCzar, czar, username, submitActionLoading } = this.props
    const { selected, winner } = this.state

    if (submitActionLoading) return <Spinner color="secondary" size={32} />

    if (status.key === PLAYERS_SUBMITTING) {
      if (isCzar) return 'Waiting for everyone to submit cards to you'
      if (players.find(p => p.username === username).submitted) return 'Waiting on other players'

      const selectedCount = selected.length
      if (selectedCount === prompt.pick)
        return (
          <Button variant="outlined" onClick={this.handleSubmitOwnCardsClick}>
            Submit Your Card{prompt.pick === 1 ? '' : 's'}
          </Button>
        )
      return `Pick your card${prompt.pick === 1 ? '' : 's'}`
    }

    if (status.key === PICKING_WINNER) {
      if (winner !== null)
        return (
          <Button variant="outlined" onClick={this.handleSubmitWinnerClick}>
            Submit Your Choice
          </Button>
        )
      return `${isCzar ? "You're" : `${czar} is`} picking the winner`
    }

    if (status.key === WINNER) return `${status.data} won!`

    return null
  }

  renderPlayer(p) {
    const { username, czar, status } = this.props

    const isPlayer = username === p.username
    let statusText = p.submitted ? 'Played' : 'Submitting'
    if (!p.isActive) statusText = 'Inactive'
    if (status.key === WINNER && status.key === p.username) statusText = 'Winner!'

    return (
      <div
        key={p.username}
        styleName={style({ czar: czar === p.username, player: isPlayer, inactive: !p.isActive })}
      >
        <Typography variant="body2">{isPlayer ? 'You' : p.username}</Typography>
        <Typography variant="body2">{p.winningCards.length}</Typography>
        {czar === p.username ? (
          <Typography variant="caption" className="green">
            <b>Czar</b>
          </Typography>
        ) : (
          <Typography variant="caption" color="secondary">
            {statusText}
          </Typography>
        )}
      </div>
    )
  }

  renderPlayedCards = (usernameOrSet, idx) => {
    const { status, prompt, isCzar } = this.props
    const { winner } = this.state

    if (status.key === PLAYERS_SUBMITTING)
      return (
        <div key={`playedCards_hidden_${usernameOrSet}`}>
          {[...Array(prompt.pick).keys()].map(num => (
            <Card
              key={`playedCard_${num}_${usernameOrSet}`}
              id={`playedCard_${num}_${usernameOrSet}`}
              text={'Cards<br />Against<br />Humanity'}
              canSelect={false}
              small
            />
          ))}
        </div>
      )

    const cards = usernameOrSet.map(text => (
      <Card
        key={`playedCard_${text}`}
        id={`playedCard_${text}`}
        text={text}
        onClick={this.selectOtherPlayersCard}
        canSelect={false}
        small
      />
    ))

    return status.key === PICKING_WINNER && isCzar ? (
      <Button
        key={`playedCards_visible_${usernameOrSet.join(',')}`}
        onClick={() => this.handleWinnerClick(idx)}
        styleName={style({ winner: winner === idx })}
      >
        {cards}
      </Button>
    ) : (
      <div key={`playedCards_visible_${usernameOrSet.join(',')}`}>{cards}</div>
    )
  }

  renderYourCard = (text, idx) => {
    const { username, prompt, status, players, isCzar } = this.props
    const { selected } = this.state

    let canSelect =
      !isCzar &&
      status.key === PLAYERS_SUBMITTING &&
      !players.find(p => p.username === username).submitted
    // When you have the full number of cards selected, and it's > 1, other cards are not buttons
    if (prompt.pick > 1 && selected.length === prompt.pick && !selected.includes(idx))
      canSelect = false

    return (
      <Card
        key={`yourCard_${text}`}
        id={`yourCard_${text}`}
        text={text}
        onClick={canSelect ? () => this.handleOwnCardClick(idx) : () => {}}
        selected={selected.includes(idx) ? selected.indexOf(idx) + 1 : null}
        canSelect={canSelect}
        owned
      />
    )
  }

  render() {
    const { name, prompt, playedCardsThisRound, yourCards, players } = this.props
    const { selected, winner } = this.state

    let blackCardFont = 'h5'
    if (prompt.text.length > 150) blackCardFont = 'body1'
    else if (prompt.text.length > 125) blackCardFont = 'h6'

    return (
      <div>
        <Typography variant="h2">{name}</Typography>
        <div
          styleName={style({
            status: true,
            ready: selected.length === prompt.pick || winner !== null,
          })}
        >
          <Typography variant="h5">{this.renderStatusText()}</Typography>
        </div>
        <MCard styleName="blackCard">
          <Typography
            variant={blackCardFont}
            dangerouslySetInnerHTML={{
              __html: prompt.text.split('_').join(`<span>________</span>`),
            }}
          />
          <div styleName="pick">
            <div>
              <Typography variant="body1">PICK</Typography>
            </div>
            <div>
              <Typography variant="body1">{prompt.pick}</Typography>
            </div>
          </div>
        </MCard>
        <div styleName="playedCards">{playedCardsThisRound.map(this.renderPlayedCards)}</div>
        <div styleName="players">{players.map(p => this.renderPlayer(p))}</div>
        <div styleName="yourCards" className="flex-centered">
          {yourCards.map(this.renderYourCard)}
        </div>
      </div>
    )
  }
}

CAH.propTypes = {
  status: PropTypes.shape({
    key: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
  }).isRequired,
  czar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  prompt: PropTypes.shape({
    text: PropTypes.string.isRequired,
    pick: PropTypes.number.isRequired,
  }).isRequired,
  playedCardsThisRound: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  ).isRequired,
  yourCards: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      winningCards: PropTypes.arrayOf(PropTypes.string).isRequired,
      submitted: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  username: PropTypes.string.isRequired,
  isCzar: PropTypes.bool.isRequired,
  submitActionLoading: PropTypes.bool.isRequired,
  submitAction: PropTypes.func.isRequired,
}

export default CAH

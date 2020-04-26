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
  actions: { SUBMIT_CARDS, PICK_WINNER, SWAP_CARDS },
} = games[gameNames.CAH]

class CAH extends PureComponent {
  state = { selected: [], winner: null, isSwapping: false, toSwap: [] }

  handleSubmitOwnCardsClick = () => {
    const { yourCards, submitAction } = this.props
    const { selected } = this.state

    const cardTexts = selected.map(idx => yourCards[idx])

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

  handleSwapToggle = () => {
    this.setState(({ isSwapping }) => ({ isSwapping: !isSwapping, toSwap: [], selected: [] }))
  }

  handleSubmitOwnCardsSwapClick = () => {
    const { yourCards, submitAction } = this.props
    const { toSwap } = this.state

    const cardTexts = toSwap.map(idx => yourCards[idx])

    submitAction(SWAP_CARDS, cardTexts, () => this.setState({ toSwap: [], isSwapping: false }))
  }

  handleOwnCardSwapClick = idx => {
    const { remainingSwaps } = this.props
    const { toSwap } = this.state

    const isAlreadySelected = toSwap.includes(idx)
    if (isAlreadySelected) this.setState({ toSwap: addOrRemoveFromArr(toSwap, idx) })
    else if (remainingSwaps > toSwap.length) this.setState({ toSwap: [...toSwap, idx] })
    else if (remainingSwaps === 1) this.setState({ selected: isAlreadySelected ? [] : [idx] })
  }

  renderStatusText() {
    const {
      remainingSwaps,
      prompt,
      status,
      players,
      isCzar,
      czar,
      username,
      submitActionLoading,
    } = this.props
    const { isSwapping, toSwap, selected, winner } = this.state

    if (submitActionLoading) return <Spinner color="secondary" size={32} />

    if (isSwapping)
      return toSwap.length ? (
        <Button variant="outlined" onClick={this.handleSubmitOwnCardsSwapClick}>
          Swap Selected Card{toSwap.length === 1 ? '' : 's'}
        </Button>
      ) : (
        `Select up to ${remainingSwaps} card${remainingSwaps === 1 ? '' : 's'} to swap`
      )

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

    let statusText = p.submitted ? 'Played' : 'Submitting'
    if (status.key === PICKING_WINNER && !p.submitted) statusText = 'Waiting to play' // Player joined during winner picking
    if (!p.isActive) statusText = 'Inactive'
    if (status.key === WINNER && status.key === p.username) statusText = 'Winner!'

    return (
      <div
        key={p.username}
        styleName={style({
          czar: czar === p.username,
          player: username === p.username,
          inactive: !p.isActive,
        })}
      >
        <Typography variant="body2">{p.username}</Typography>
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

    if (status.key === PICKING_WINNER) {
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
      return isCzar ? (
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

    const { player, playedCards } = usernameOrSet

    return (
      <div
        key={`playedCards_visible_${playedCards.join(',')}`}
        styleName={style({ won: player === status.data })}
      >
        {playedCards.map(text => (
          <Card
            key={`playedCard_${text}`}
            id={`playedCard_${text}`}
            text={text}
            onClick={this.selectOtherPlayersCard}
            canSelect={false}
            small
          />
        ))}
      </div>
    )
  }

  renderYourCard = (text, idx) => {
    const { remainingSwaps, username, prompt, status, players, isCzar } = this.props
    const { isSwapping, toSwap, selected } = this.state

    const coreProps = { key: `yourCard_${text}`, id: `yourCard_${text}`, text, owned: true }

    if (isSwapping) {
      let canSelect = !!remainingSwaps
      // When you have the max swappable cards selected, and its > 1, other cards can't be selected
      if (
        canSelect &&
        remainingSwaps > 1 &&
        toSwap.length === remainingSwaps &&
        !toSwap.includes(idx)
      )
        canSelect = false
      return (
        <Card
          {...coreProps}
          onClick={remainingSwaps ? () => this.handleOwnCardSwapClick(idx) : () => {}}
          selected={toSwap.includes(idx) ? toSwap.indexOf(idx) + 1 : null}
          canSelect={canSelect}
        />
      )
    }

    let canSelect =
      !isCzar &&
      status.key === PLAYERS_SUBMITTING &&
      !players.find(p => p.username === username).submitted
    // When you have the full number of cards selected, and it's > 1, other cards can't be selected
    if (prompt.pick > 1 && selected.length === prompt.pick && !selected.includes(idx))
      canSelect = false

    return (
      <Card
        {...coreProps}
        onClick={canSelect ? () => this.handleOwnCardClick(idx) : () => {}}
        selected={selected.includes(idx) ? selected.indexOf(idx) + 1 : null}
        canSelect={canSelect}
      />
    )
  }

  render() {
    const { name, prompt, playedCardsThisRound, yourCards, players, remainingSwaps } = this.props
    const { selected, winner, toSwap, isSwapping } = this.state

    let blackCardFont = 'h5'
    if (prompt.text.length > 150) blackCardFont = 'body1'
    else if (prompt.text.length > 125) blackCardFont = 'h6'

    return (
      <div>
        <Typography variant="h2">{name}</Typography>
        <div
          styleName={style({
            status: true,
            ready: selected.length === prompt.pick || winner !== null || !!toSwap.length,
          })}
        >
          <Typography variant="h5">{this.renderStatusText()}</Typography>
        </div>
        <div styleName="players">{players.map(p => this.renderPlayer(p))}</div>
        <div className="hide-on-desktop" styleName="playedCards">
          {playedCardsThisRound.map(this.renderPlayedCards)}
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
        <div className="hide-on-mobile" styleName="playedCards">
          {playedCardsThisRound.map(this.renderPlayedCards)}
        </div>
        <div styleName="yourCards" className="flex-centered">
          {yourCards.map(this.renderYourCard)}
        </div>
        <div styleName={style({ swap: true, disabled: !remainingSwaps })} className="flex-centered">
          {isSwapping ? (
            <Button variant="outlined" onClick={this.handleSwapToggle}>
              Cancel Swapping
            </Button>
          ) : (
            <Button variant="outlined" disabled={!remainingSwaps} onClick={this.handleSwapToggle}>
              {remainingSwaps
                ? `Pick Up To ${remainingSwaps} Card${remainingSwaps === 1 ? '' : 's'} To Swap`
                : 'No Swaps Remaining'}
            </Button>
          )}
        </div>
      </div>
    )
  }
}

const promptProp = PropTypes.shape({
  text: PropTypes.string.isRequired,
  pick: PropTypes.number.isRequired,
})

CAH.propTypes = {
  status: PropTypes.shape({
    key: PropTypes.string.isRequired,
    data: PropTypes.string,
  }).isRequired,
  czar: PropTypes.string.isRequired,
  name: PropTypes.string,
  prompt: promptProp.isRequired,
  playedCardsThisRound: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string, // Player name. When cards are being submitted
      PropTypes.arrayOf(PropTypes.string), // Card text. When winner is being picked
      // Full info. When winner was picked
      PropTypes.shape({
        player: PropTypes.string.isRequired,
        playedCards: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      }),
    ]),
  ).isRequired,
  yourCards: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  remainingSwaps: PropTypes.number.isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      winningCards: PropTypes.arrayOf(promptProp).isRequired,
      submitted: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  username: PropTypes.string.isRequired,
  isCzar: PropTypes.bool.isRequired,
  submitActionLoading: PropTypes.bool.isRequired,
  submitAction: PropTypes.func.isRequired,
}

CAH.defaultProps = {
  name: null,
}

export default CAH

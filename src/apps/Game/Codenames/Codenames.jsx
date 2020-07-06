import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import { gameNames, games } from 'shared/games'
import style from 'lib/style'

import Modal from 'components/Modal'
import TextInput from 'components/TextInput'
import Dropdown from 'components/Dropdown'
import Button from 'components/Button'
import KeyPressListener from 'components/KeyPressListener'
import Card from './Card'

import styles from './styles.css'

const {
  statuses: { STARTING, GIVING_HINT, VOTING, VOTED, WINNER },
  actions: { CHOOSE_TEAM, START_GAME, GIVE_HINT, VOTE, END_ROUND },
  values: { RED, BLUE, BLACK, TAN },
} = games[gameNames.CODENAMES]

const oppositeTeam = {
  [RED]: 'blue',
  [BLUE]: 'red',
}

class Codenames extends PureComponent {
  state = { hint: '', cap: 1, vote: null, endingRound: false }

  static getDerivedStateFromProps(props, state) {
    return props.status.key === VOTED && state.endingRound ? { ...state, endingRound: false } : null
  }

  handleHintChange = ({ target: { value } }) => {
    this.setState({ hint: value.replace(/ /g, '') })
  }

  handleCapChange = ({ target: { value } }) => {
    this.setState({ cap: value })
  }

  handleVoteSubmit = () => {
    const { submitAction } = this.props
    const {
      vote: { x, y },
    } = this.state
    submitAction(VOTE, { x, y }, () => this.setState({ vote: null }))
  }

  handleHintSubmit = () => {
    const { submitAction, submitActionLoading } = this.props
    const { hint, cap } = this.state
    if (!hint || !cap || submitActionLoading) return
    submitAction(GIVE_HINT, { hint, cap }, () => {
      this.setState({ hint: '', cap: 1 })
    })
  }

  handleEndRoundToggle = () => {
    this.setState(({ endingRound }) => ({ endingRound: !endingRound }))
  }

  handleEndRoundSubmit = () => {
    const { submitAction } = this.props
    submitAction(END_ROUND, undefined, () => {
      this.setState({ endingRound: false })
    })
  }

  handleTeamSelection(color) {
    const { submitAction } = this.props
    submitAction(CHOOSE_TEAM, color)
  }

  handleCardClick(x, y) {
    this.setState(({ vote }) => ({
      vote: vote && vote.x === x && vote.y === y ? null : { x, y },
    }))
  }

  renderSelectTeamModal() {
    const { playerTeam, red, blue, players, submitActionLoading } = this.props

    const playerMap = {}
    players.forEach(p => {
      playerMap[p.username] = p
    })

    const team = t =>
      t.players.length ? (
        t.players
          .sort(p => (playerMap[p].isActive ? -1 : 1))
          .map(p => (
            <Typography
              key={`importantInfo_team_${p}`}
              className={playerMap[p].isActive ? '' : 'med-gray'}
            >
              {p}
            </Typography>
          ))
      ) : (
        <div className="center pt2 pb2">
          <Typography variant="subtitle2">Team is empty</Typography>
        </div>
      )

    const teams = (
      <div styleName="selectTeam">
        <div>
          <div className="red center pb1">Red Team</div>
          {team(red)}
        </div>
        <div>
          <div className="blue center pb1">Blue Team</div>
          {team(blue)}
        </div>
      </div>
    )

    return (
      <Modal
        isOpen={!playerTeam}
        title="Pick a team"
        content={teams}
        buttons={[
          {
            value: 'Pick Red',
            onClick: () => this.handleTeamSelection(RED),
            className: 'bg-red white left',
          },
          {
            value: 'Pick Blue',
            onClick: () => this.handleTeamSelection(BLUE),
            className: 'bg-blue white right',
          },
        ]}
        loading={submitActionLoading}
        showSpinnerOnLoading
        buttonWrapper="mb2 ml3 mr3 pl2 pr2 flex-centered"
      />
    )
  }

  renderStatus() {
    const {
      status,
      red,
      blue,
      isOwner,
      owner,
      board,
      playerTeam,
      playerTeamIsPlaying,
      playerTeamData,
      playerVote,
      spyLayout,
      teamIsVoting,
      submitAction,
      submitActionLoading,
    } = this.props
    const { vote, endingRound } = this.state

    const enoughPlayersInGame = red.players.length >= 2 && blue.players.length >= 2

    let text = null
    let ready = false
    let thinPadding = false
    if (!playerTeamData) {
      text = 'Pick a team'
    } else if (status.key === STARTING) {
      text = 'Waiting for more players to join the game'
      if (enoughPlayersInGame) {
        if (isOwner) {
          text = (
            <Button
              variant="outlined"
              onClick={() => submitAction(START_GAME)}
              loading={submitActionLoading}
              spinnerColor="black"
            >
              Start Game
            </Button>
          )
          ready = true
        } else {
          text = `Waiting on ${owner} to start the game`
        }
      }
    } else if (status.key === GIVING_HINT) {
      if (playerTeamIsPlaying) {
        if (spyLayout) {
          const { hint, cap } = this.state
          thinPadding = true
          ready = !!(hint && cap)
          text = (
            <div>
              <KeyPressListener onKeyPress={this.handleHintSubmit} enterKey />
              <TextInput
                name="hint"
                id="hint"
                value={hint}
                placeholder="Hint"
                styleName="hint"
                onChange={this.handleHintChange}
                inputProps={{ classes: { underline: styles.underline } }}
              >
                Hint
              </TextInput>
              <Dropdown
                name="cap"
                id="cap"
                value={cap}
                onChange={this.handleCapChange}
                styleName="cap"
                className="ml3 mr3"
                options={[
                  ...[...Array(playerTeamData.cardCount).keys()].slice(1),
                  playerTeamData.cardCount,
                ]}
                inputProps={{
                  classes: { underline: `${styles.underline} ${styles.capInnerWrapper}` },
                }}
              />
              <div className="inline-block" styleName="hintButton">
                <Button
                  variant="outlined"
                  disabled={!ready}
                  onClick={this.handleHintSubmit}
                  loading={submitActionLoading}
                  spinnerColor="black"
                >
                  Give Hint
                </Button>
              </div>
            </div>
          )
        } else {
          text = `Waiting for ${playerTeamData.spymaster}'s hint`
        }
      } else {
        text = `${playerTeam === RED ? blue.spymaster : red.spymaster} is giving the ${
          oppositeTeam[playerTeam]
        } team a hint`
      }
    } else if (status.key === VOTING) {
      if (teamIsVoting) {
        if (spyLayout) {
          if (endingRound) {
            text = (
              <Button
                variant="outlined"
                loading={submitActionLoading}
                spinnerColor="black"
                onClick={this.handleEndRoundSubmit}
              >
                Confirm Round End
              </Button>
            )
            ready = true
          } else text = 'Your team is voting'
        } else {
          ready = !!vote
          if (vote)
            text = (
              <Button
                variant="outlined"
                onClick={this.handleVoteSubmit}
                loading={submitActionLoading}
                spinnerColor="black"
              >
                Submit Your Vote
              </Button>
            )
          else if (playerVote)
            text =
              status.data.votes.length === 1
                ? 'Waiting for everyone to vote - change your vote if needed'
                : 'Multiple cards voted on - you must all vote on the same card'
          else text = 'Pick a card'
        }
      } else text = `The ${oppositeTeam[playerTeam]} team is voting`
    } else if (status.key === VOTED) {
      const { color } = board[status.data.vote.y][status.data.vote.x]
      const otherTeam = oppositeTeam[playerTeam]
      if (playerTeamIsPlaying) {
        const you = caps => `${caps ? 'Y' : 'y'}${spyLayout ? 'our team' : 'ou'}`
        text = `Too bad - ${you()} picked a tan card`
        if (status.data.pickedRightTeam) text = `Hooray! ${you(true)} got it!`
        else if (status.data.pickedWrongTeam)
          text = `Uh oh! ${you(true)} picked a ${otherTeam} card!`
        else if (color === BLACK) text = `WOMP! ${you(true)} picked the black card!`
      } else {
        text = `Lucky you - the ${otherTeam} team picked a tan card`
        if (status.data.pickedRightTeam) text = `Watch out! They found a ${otherTeam} card!`
        else if (status.data.pickedWrongTeam) text = 'Nice! They picked one of your cards!'
        else if (color === BLACK) text = 'BAM! They picked the black card!'
      }
    } else if (status.key === WINNER) {
      text = status.data === playerTeam ? 'You won!!!' : 'You lost - better luck next time!'
    }

    return (
      <div styleName={style({ status: true, ready, thinPadding })}>
        {typeof text === 'string' ? <Typography variant="h5">{text}</Typography> : text}
      </div>
    )
  }

  renderTeam(color) {
    const { red, blue, players, status, username } = this.props
    const VOTED_TEXT = 'Voted'
    const INACTIVE_TEXT = 'Inactive'
    const { players: teamPlayers, score, playing, spymaster } = color === RED ? red : blue
    const playerMap = {}
    players.forEach(p => {
      playerMap[p.username] = p
    })

    const statusText = p => {
      const { isActive, vote } = playerMap[p]
      if (!isActive) return INACTIVE_TEXT
      if (playing && [VOTING, VOTED].includes(status.key) && p !== spymaster)
        return vote ? VOTED_TEXT : 'Voting'
      if (p === spymaster)
        return playing && status.key === GIVING_HINT ? 'Giving hint' : 'Spymaster'
    }

    const renderPlayer = ({ text, p }) => {
      const className = style({
        red: p === spymaster && color === RED,
        blue: p === spymaster && color === BLUE,
        green: text === VOTED_TEXT,
        'med-gray': text === INACTIVE_TEXT,
        [styles.self]: p === username,
        ellipsis: true,
      })
      return (
        <div styleName="teamPlayer" key={`teamInfo_team_${p}`}>
          <div>
            <Typography variant="body1" className={className}>
              {p}
            </Typography>
          </div>
          <div>
            <Typography variant="body1" className={className}>
              {text}
            </Typography>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div
          className={style({
            'center mb1 clearfix': true,
            red: color === RED,
            blue: color === BLUE,
            [styles.team]: true,
            [styles.activeTeam]: playing,
          })}
        >
          <Typography className="left" variant="h5">
            {color === RED ? 'Red' : 'Blue'}
          </Typography>
          <Typography className="right" variant="h5">
            {score}
          </Typography>
        </div>
        {teamPlayers
          .map(p => ({ text: statusText(p), p }))
          .sort(({ text }) => (text === INACTIVE_TEXT ? 1 : -1))
          .map(renderPlayer)}
      </div>
    )
  }

  render() {
    const {
      status,
      board,
      spyLayout,
      playerVote,
      playerTeamIsPlaying,
      submitActionLoading,
    } = this.props
    const { vote, endingRound } = this.state

    const { hint, count, cap } = ([VOTING, VOTED].includes(status.key) && status.data) || {}
    const playerTeamCanVoteAgain =
      playerTeamIsPlaying &&
      (status.key === VOTING ||
        (status.key === VOTED &&
          status.data.pickedRightTeam &&
          status.data.cap >= status.data.count))
    return (
      <div>
        {this.renderSelectTeamModal()}
        {this.renderStatus()}
        <div className="flex-centered" styleName="mainContainer">
          <div styleName="board">
            {board.map((row, y) =>
              row.map(({ text, hidden, color }, x) => (
                <Card
                  key={`card_${text}`}
                  text={text}
                  hidden={hidden}
                  color={spyLayout ? spyLayout[y][x] : color}
                  showOutline={!!spyLayout}
                  selected={!!(vote && vote.x === x && vote.y === y)}
                  canSelect={
                    hidden &&
                    playerTeamCanVoteAgain &&
                    !spyLayout &&
                    (!playerVote || playerVote.x !== x || playerVote.y !== y)
                  }
                  voted={
                    status.key === VOTING && status.data.votes.some(v => v.x === x && v.y === y)
                  }
                  playerVote={
                    status.key === VOTING &&
                    !!playerVote &&
                    playerVote.x === x &&
                    playerVote.y === y
                  }
                  conflict={
                    status.key === VOTING &&
                    status.data.votes.length > 1 &&
                    status.data.votes.some(v => v.x === x && v.y === y)
                  }
                  onClick={() => this.handleCardClick(x, y)}
                />
              )),
            )}
          </div>
          <div styleName="teams">
            {this.renderTeam(RED)}
            {this.renderTeam(BLUE)}
          </div>
        </div>
        {hint && (
          <div styleName="hintShade" className="center">
            <Typography variant="h5">
              {hint}
              <span className="ml3 mr3">|</span>
              <b>
                {Math.min(count + 1, cap + 1)}/{cap}
              </b>
            </Typography>
            {spyLayout && playerTeamCanVoteAgain && (
              <Button
                className="ml3"
                variant="outlined"
                onClick={this.handleEndRoundToggle}
                loading={submitActionLoading}
                spinnerColor="black"
                spinnerSize={24}
                spinnerClasses={`ml3 ${styles.hintShadeSpinner}`}
              >
                {endingRound ? 'Nevermind' : 'End Round'}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
}

const teamProps = PropTypes.shape({
  score: PropTypes.number.isRequired,
  spymaster: PropTypes.string,
  playing: PropTypes.bool.isRequired,
  cardCount: PropTypes.number.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
})

Codenames.propTypes = {
  owner: PropTypes.string.isRequired,
  status: PropTypes.shape({
    key: PropTypes.string.isRequired,
    data: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  }).isRequired,
  red: teamProps.isRequired,
  blue: teamProps.isRequired,
  playerTeamData: teamProps,
  board: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        hidden: PropTypes.bool.isRequired,
        color: PropTypes.string, // RED, BLUE, BLACK, TAN, null
      }).isRequired,
    ).isRequired,
  ).isRequired,
  spyLayout: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOf([RED, BLUE, BLACK, TAN]))),
  players: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      team: PropTypes.oneOf([RED, BLUE]),
      vote: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
    }),
  ).isRequired,
  playerVote: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
  playerTeam: PropTypes.string, // RED, BLUE, null
  playerTeamIsPlaying: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  teamIsVoting: PropTypes.bool,
  isOwner: PropTypes.bool.isRequired,
  submitActionLoading: PropTypes.bool.isRequired,
  submitAction: PropTypes.func.isRequired,
}

Codenames.defaultProps = {
  playerTeam: null,
  spyLayout: null,
  teamIsVoting: null,
  playerTeamData: null,
  playerVote: null,
}

export default Codenames

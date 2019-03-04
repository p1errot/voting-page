import VoteIcon from './voteIconButton';

/**
 * VoteCard
 * Generates voting card html node
 * @constructor
 * @param {object} options 
 */

class VoteCard {
    constructor(options = {}) {
        const defaults = {
            area: '',
            description: '',
            handleVote: () => {},
            id: '',
            name: '',
            voteTime: '',
            voteYes: 0,
            voteNo: 0
        };

        this.options = {
            ...defaults,
            ...options
        };
    };

    handleVote(event) {
        const { handleVote } = this.options;
        const button = event.currentTarget;
        const pollActions = button.parentElement;
        const elementChecked = Array
            .from(pollActions.querySelectorAll('input'))
            .find(el => el.checked);
        const value = elementChecked ? elementChecked.value : undefined;

        if (typeof handleVote === 'function') {
            handleVote(this.options.id, value);
        }
    }

    handleVoteAgain(event) {
        const { handleVote } = this.options;

        if (typeof handleVote === 'function') {
            handleVote(this.options.id, null);
        }
    }

    handleVoteIcon(event) {
        const container = event.currentTarget;
        const labels = container.querySelectorAll('label');

        labels.forEach(el => {
            const input = el.querySelector('input');

            if (!input.checked) {
                el.classList.remove('selected');
            }
        });
    }

    createContent() {
        const pollItemContent = document.createElement('div');
        pollItemContent.classList.add('poll-item__content', 'd-flex');

        pollItemContent.appendChild(this.createFinalResult());
        pollItemContent.appendChild(this.createDescription());

        return pollItemContent;
    }

    createDescription() {
        const description = document.createElement('div');
        description.classList.add('poll-description');

        const name = document.createElement('h3');
        name.classList.add('poll-description__name');
        name.innerText = this.options.name;

        const area = document.createElement('p');
        area.classList.add('poll-description__area');

        const strongArea = document.createElement('strong');
        strongArea.innerText = this.options.voteTime;

        area.appendChild(strongArea);
        area.innerText = `in ${this.options.area}`;

        const resume = document.createElement('p');
        resume.classList.add('poll-description__resume');
        resume.innerText = this.options.voted ? 'Thank you for voting!' : this.options.description;

        description.appendChild(name);
        description.appendChild(area);
        description.appendChild(resume);

        if (!this.options.voted) {
            description.appendChild(this.createPollActions());
        } else {
            description.appendChild(this.createVoteAgain());
        }

        return description;
    }

    createFinalResult() {
        const { voteYes, voteNo } = this.options;
        const veredict = voteYes >= voteNo ? 'up' : 'down';

        const finalResult = document.createElement('div');
        finalResult.classList.add(
            'final-result',
            `final-result--${veredict}`
        );

        const icon = document.createElement('i');
        icon.classList.add(`icofont-thumbs-${veredict}`);

        finalResult.appendChild(icon);

        return finalResult;
    }

    createOverlay() {
        const pollItemOverlay = document.createElement('div');
        pollItemOverlay.classList.add('poll-item__overlay');

        return pollItemOverlay;
    }

    createPollActions() {
        const pollActions = document.createElement('div');
        pollActions.classList.add('poll-actions');

        pollActions.appendChild(VoteIcon({
            type: 'up',
            name: `vote-${this.options.id}`,
        }).render());

        pollActions.appendChild(VoteIcon({
            type: 'down',
            name: `vote-${this.options.id}`,
        }).render());

        pollActions.appendChild(this.createVoteButton());
        pollActions.addEventListener('click', this.handleVoteIcon);

        return pollActions;
    }

    createPollItem() {
        const pollItem = document.createElement('div');
        pollItem.classList.add('poll-item', 'd-flex');
        pollItem.style.backgroundImage = `url(../img/${this.options.id}.jpg)`;

        pollItem.appendChild(this.createOverlay());
        pollItem.appendChild(this.createContent());
        pollItem.appendChild(this.createResults());

        return pollItem;
    }

    createResults() {
        const { voteYes, voteNo } = this.options;
        const totalVotes = voteYes + voteNo;
        const downPercent = Math.round(((voteNo / totalVotes) || 0) * 100);
        const upPercent = 100 - downPercent;

        const pollItemResults = document.createElement('div');
        pollItemResults.classList.add('poll-item__results', 'd-flex');

        const resultsUp = document.createElement('div');
        resultsUp.classList.add('results', 'results--up', 'text-left');
        resultsUp.style.width = `${upPercent}%`;

        const iconUp = document.createElement('i');
        iconUp.classList.add('icofont-thumbs-up');

        resultsUp.appendChild(iconUp);
        resultsUp.innerText = `${upPercent}%`;

        const resultsDown = document.createElement('div');
        resultsDown.classList.add('results', 'results--down', 'text-right');
        resultsDown.style.width = `${downPercent}%`;

        const iconDown = document.createElement('i');
        iconDown.classList.add('icofont-thumbs-down');

        resultsDown.appendChild(iconDown);
        resultsDown.innerText = `${downPercent}%`;

        if (upPercent) {
            pollItemResults.appendChild(resultsUp);
        }

        if (downPercent) {
            pollItemResults.appendChild(resultsDown);
        }

        return pollItemResults;
    }

    createVoteButton() {
        const voteButton = document.createElement('button');

        voteButton.classList.add('poll-actions__cta');
        voteButton.setAttribute('type', 'button');
        voteButton.setAttribute('role', 'button');
        voteButton.innerText = 'Vote now';
        voteButton.addEventListener('click', this.handleVote.bind(this));

        return voteButton;
    }

    createVoteAgain() {
        const voteButtonCont = document.createElement('div');
        const voteButton = document.createElement('button');

        voteButtonCont.classList.add('poll-vote-again');

        voteButton.classList.add('poll-actions__cta-again');
        voteButton.setAttribute('type', 'button');
        voteButton.setAttribute('role', 'button');
        voteButton.innerText = 'Vote again';
        voteButton.addEventListener('click', this.handleVoteAgain.bind(this));

        voteButtonCont.appendChild(voteButton);

        return voteButtonCont;
    }

    render() {
        const item = document.createElement('article');
        item.classList.add('item', 'col');
        item.appendChild(this.createPollItem());

        return item;
    }
}

const voteCard = (options) => {
    return new VoteCard(options);
}

export default voteCard;

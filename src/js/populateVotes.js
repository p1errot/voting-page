import voteCard from './components/voteCard';
import service from './lib/serviceCaller';

class PopulateVotes {
    constructor(parentContainerClass, votingList) {
        if (typeof PopulateVotes.instance === 'object') {
            PopulateVotes.instance.list = votingList || [];

            return PopulateVotes.instance;
        }

        PopulateVotes.instance = this;
        this.sessionItem = 'voting-list';
        this.list = votingList || [];
        this.parentContainerClass = parentContainerClass;
    };

    clearElement() {
        const elementNode = this.getElementToAppend()

        elementNode.innerHTML = "";

        return elementNode;
    }

    getElementToAppend() {
        const classSelector = `.${this.parentContainerClass.replace(/\./gi, '')}`
        return document.querySelector(classSelector);
    };

    getStorageData() {
        return JSON.parse(sessionStorage.getItem(this.sessionItem));
    }

    getVoteList() {
        const itemsList = this.getStorageData();

        if (itemsList) {
            this.renderList(itemsList);
        } else {
            service('../resources/voting-list.json')
                .then(this.renderList.bind(this));
        }
    };

    handleVote(id, value) {
        // TODO
        // Update data to the server
        this.renderList(this.updateElement(id, value));
    }

    updateElement(id, value) {
        const elementIndex = this.list.findIndex(el => el.id === id);
        const newList = [ ...this.list ];
        const voteYes = newList[elementIndex].voteYes;
        const voteNo = newList[elementIndex].voteNo;

        newList[elementIndex].voteYes = value === 'yes' ? voteYes + 1 : voteYes;
        newList[elementIndex].voteNo = value === 'no' ? voteNo + 1 : voteNo;
        newList[elementIndex].voted = !!value;

        this.list = [ ...newList ];

        return this.list;
    }

    renderList(list) {
        this.saveInStorage(list);
        this.list = list;

        this.clearElement();

        list.forEach(el => {
            const options = {
                ...el,
                handleVote: this.handleVote.bind(this),
            };

            const card = voteCard(options).render();
            this.getElementToAppend().appendChild(card);
        });
    };

    saveInStorage(list) {
        sessionStorage.setItem(this.sessionItem, JSON.stringify(list));

        return sessionStorage.key(this.sessionItem);
    };

    init() {
        this.getVoteList();

        return this;
    };

    get itemName() {};
};

const populateVotes = (containerClass, votingList) => {
    const instance = new PopulateVotes(containerClass, votingList);

    return instance.init();
};

export default populateVotes;
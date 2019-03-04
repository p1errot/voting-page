class VoteIconButton {
    constructor(options = { type: 'up', name: 0, classList: [], callback}) {
        this.classList = options.classList;
        this.type = options.type === 'up' ? options.type : 'down';
        this.name = options.name;
    }

    handleClick(event) {
        const label = event.currentTarget;
        label.classList.add('selected');
    }

    createIcon() {
        const icon = document.createElement('i');
        icon.classList.add(`icofont-thumbs-${this.type}`);

        return icon;
    }

    createInput() {
        const value = this.type === 'up' ? 'yes' : 'no';
        const input = document.createElement('input');

        input.setAttribute('id', `${this.name}-${this.type}`);
        input.setAttribute('name', `${this.name}`);
        input.setAttribute('type', 'radio');
        input.setAttribute('value', value);

        return input;
    }

    createLabel() {
        const label = document.createElement('label');
        label.classList.add(
            'poll-actions__vote',
            `poll-actions__vote--${this.type}`
        );

        label.addEventListener('click', this.handleClick);

        return label;
    }

    render() {
        const label = this.createLabel();

        label.appendChild(this.createInput());
        label.appendChild(this.createIcon());

        return label;
    }
}

const voteIcon = (options) => {
    return new VoteIconButton(options);
}

export default voteIcon;

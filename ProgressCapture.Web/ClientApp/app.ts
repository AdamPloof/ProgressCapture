// Stylesheets
import './styles/styles.scss';

// JS
import 'bootstrap';
import './components/Root';

console.log("App started.");

function initProgressTypeForm(progressTypesList: Element): void {
    console.log('Initializing progress type form');
    const inputs: NodeList = progressTypesList.querySelectorAll('input[type=number]');
    const lastInput: Node = inputs[inputs.length - 1];
    if (!(lastInput instanceof HTMLInputElement)) {
        throw new Error(`Expected node to be input element. Got: ${typeof lastInput}`);
    }

    const addProgressTypeBtn = document.getElementById('add-progress-type-btn')
    if (!(addProgressTypeBtn instanceof HTMLButtonElement)) {
        throw new Error(
            `Expected addProgressTypeBtn to be of type HTMLButtonElement. Got ${typeof addProgressTypeBtn}`
        );
    }

    const match = lastInput.name.match(/\[(\d+)\]/);
    const idx: number = match ? Number(match[1]) : -1;
    if (idx === -1) {
        throw new Error("Could not determine index of last progress entry");
    }

    let nextIdx = idx + 1;

    const handleAddProgressType = (e: Event): void => {
        e.preventDefault();
        const formPrototype: string = `<div class="d-flex flex-column border p-3 rounded progress-type-form-wrapper">
            <input type="hidden" id="ProgressTypes_%idx%__Id" name="ProgressTypes[%idx%].Id" value="">
            <div class="d-flex flex-row column-gap-4">
                <div class="form-group flex-grow-1 mb-3">
                    <label for="ProgressTypes_%idx%__Name">Name</label>
                    <input class="form-control" type="text" data-val="true" data-val-length="Maximum length is 255" data-val-length-max="255" data-val-required="The Name field is required." id="ProgressTypes_%idx%__Name" maxlength="255" name="ProgressTypes[%idx%].Name" value="">
                    <span class="text-danger field-validation-valid" data-valmsg-for="ProgressTypes[%idx%].Name" data-valmsg-replace="true"></span>
                </div>
                <div class="form-group flex-grow-1 mb-3">
                    <label for="ProgressTypes_%idx%__Description">Description</label>
                    <input class="form-control" type="text" data-val="true" data-val-length="Maximum length is 1024" data-val-length-max="1024" id="ProgressTypes_%idx%__Description" maxlength="1024" name="ProgressTypes[%idx%].Description" value="">
                    <span class="text-danger field-validation-valid" data-valmsg-for="ProgressTypes[%idx%].Description" data-valmsg-replace="true"></span>
                </div>
            </div>
            <div class="form-group mb-3">
                <label for="ProgressTypes_%idx%__Target">Hours</label>
                <input class="form-control" type="number" data-val="true" data-val-required="The Target field is required." id="ProgressTypes_%idx%__Target" name="ProgressTypes[%idx%].Target" value=""><input name="__Invariant" type="hidden" value="ProgressTypes[%idx%].Target">
                <span class="text-danger field-validation-valid" data-valmsg-for="ProgressTypes[%idx%].Target" data-valmsg-replace="true"></span>
            </div>
        </div>`;
        const formHtml = formPrototype.replace(/%idx%/g, String(nextIdx));
        nextIdx++;

        const temp = document.createElement('div');
        temp.innerHTML = formHtml.trim();
        const newProgressType = temp.firstChild;
        if (!(newProgressType instanceof Element)) {
            throw new Error(`New Progress Type form should be an Element, got ${typeof newProgressType}`);
        }

        progressTypesList.appendChild(newProgressType);
    };

    addProgressTypeBtn.addEventListener('click', handleAddProgressType);
}

function main(): void {
    const progressTypesList = document.getElementById('progress-types-list');
    if (progressTypesList) {
        initProgressTypeForm(progressTypesList);
    }
}

document.addEventListener('DOMContentLoaded', main);

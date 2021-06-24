import $ from 'jquery';
import './styles/tiling_display.scss';

import { rowCol, factor } from '../consumers/service';

class TilingDisplay {
  constructor(tiling, plotDiv, expanded, callback, parentDom) {
    this.tiling = tiling;
    this.plotDiv = plotDiv;
    this.expanded = expanded || (tiling.verified && Object.keys(tiling.verified).length);
    this.callback = callback;
    this.parentDom = parentDom;
    this.plot();
  }

  plot() {
    this.addTopFigure();
    this.addClipboardButtons();
    this.parentDom.append(`<div class="accordion" id="accordionPanelsStayOpenExample">
      ${this.cellBasesDiv()}
      ${this.crossingDiv()}
      ${this.requirementsDiv()}
      ${this.assumptionsDiv()}
    </div>`);
    this.addVerifies();
    this.addStrategies();
  }

  addTopFigure() {
    const container = document.createElement('div');
    container.id = 'top-modal-figure';
    //container.classList.add('d-flex p-2');
    container.append(this.plotDiv);
    this.parentDom.append(container);
  }

  addClipboardButtons() {
    this.parentDom.append('<Button id="copy-json">JSON</Button>');
    this.parentDom.append('<Button id="copy-repl">REPL</Button>');

    $('#copy-json').on('click', () => {
      navigator.clipboard.writeText(JSON.stringify(this.tiling.tilingJson));
    });
    $('#copy-repl').on('click', () => {
      console.log('TODO: Implement');
    });
  }

  cellBasesDiv() {
    if (!this.tiling.plot.label_map || !Object.keys(this.tiling.plot.label_map).length) {
      return '';
    }
    return `<div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
          Cell bases
        </button>
      </h2>
      <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
        <div class="accordion-body">
          <ul>
            ${Object.entries(this.tiling.plot.label_map)
              .map(([key, value]) => `<li>${key}: ${value}</li>`)
              .join('')}
          </ul>
        </div>
      </div>
    </div>`;
  }

  crossingDiv() {
    if (!this.tiling.plot.crossing?.length) return '';
    return `<div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
          Crossing obstructions
        </button>
      </h2>
      <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
        <div class="accordion-body">
          <ol>${this.tiling.plot.crossing.map((v) => `<li>${v}</li>`).join('')}</ol>
        </div>
      </div>
    </div>`;
  }

  requirementsDiv() {
    if (!this.tiling.plot.requirements?.length) return '';
    return `<div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingThree">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
          Requirements
        </button>
      </h2>
      <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
        <div class="accordion-body">
          <ol>${this.tiling.plot.requirements.map((v) => `<li>${v}</li>`).join('')}</ol>
        </div>
      </div>
    </div>`;
  }

  assumptionsDiv() {
    if (!this.tiling.plot.assumptions?.length) return '';
    return `<div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingFour">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
          Assumption
        </button>
      </h2>
      <div id="panelsStayOpen-collapseFour" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingFour">
        <div class="accordion-body">
          <ol>${this.tiling.plot.assumptions.map((v) => `<li>${v}</li>`).join('')}</ol>
        </div>
      </div>
    </div>`;
  }

  addVerifies() {
    if (this.tiling.verified && Object.keys(this.tiling.verified).length) {
      this.parentDom.append('<p>Verified</p>');
      this.parentDom.append(this.tiling.verified.formal_step);
    }
  }

  addStrategies() {
    if (!this.expanded) {
      // Temp to test...
      this.parentDom.append('<h6>Strategies</h6><p>TODO</p>');
      this.parentDom.append('<Button id="btn-fac">Factor</Button>');
      this.parentDom.append('<Button id="btn-rc0">RC EAST</Button>');
      this.parentDom.append('<Button id="btn-rc1">RC NORTH</Button>');
      this.parentDom.append('<Button id="btn-rc2">RC WEST</Button>');
      this.parentDom.append('<Button id="btn-rc3">RC SOUTH</Button>');
      $('#btn-fac').on('click', async () => {
        const res = await factor(this.tiling.tilingJson);
        if (res.status === 200) {
          this.callback(res.data);
        } else {
          console.log('error');
          console.log(res);
        }
      });
      $('#btn-rc1').on('click', async () => {
        const res = await rowCol(this.tiling.tilingJson, 1);
        if (res.status === 200) {
          this.callback(res.data);
        } else {
          console.log('error');
          console.log(res);
        }
      });
    }
  }
}

export default TilingDisplay;

/**
  HOW TO EXTRACT COORDS $('#top-modal-figure .non-empty-cell').on('click', (evt) => {
  const pattern = /matrix_([\d+])_([\d+])/gm;
  const [, x, y] = pattern.exec(evt.target.className);
});
*/

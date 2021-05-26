// import { apiPost } from './consumers/instance';
// import statusCode from './consumers/status_codes';

/**
(async () => {
  const mydiv = document.getElementById('mydiv');
  const res = await apiPost('/test/5', { b: 'hi from js' }, null);
  if (res.status === statusCode.OK) {
    mydiv.innerText = `${res.data.a} and ${res.data.b}`;
  }
})();
*/
import $ from 'jquery';

import Treant from './treant/treant';

const simple = {
  nodeStructure: {
    innerHTML:
      "<div id=\"node63dbf0bc-bc9f-11eb-bf8f-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>1</div>\n            <div class=node-content\n            style='max-width:300px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>1</th></tr></table></div></div>\n            </div></div>",
    collapsable: false,
    collapsed: false,
    children: [
      {
        innerHTML:
          '<div id="node63dbf0bb-bc9f-11eb-9de6-dc7196dd2d0d"\n                data-toggle="tooltip"><div class="and-gate" id=63dbf0bb-bc9f-11eb-9de6-dc7196dd2d0d style="">+</div></div>',
        collapsable: true,
        collapsed: false,
        children: [
          {
            innerHTML:
              "<div id=\"node63db54a0-bc9f-11eb-8527-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style='border-color: Green; border-width: 3px;'><div class=label\n            style='border-color: Green; border-width: 3px;background-color: #89d75d;'>0</div>\n            <div class=node-content\n            style='max-width:300px;border-color: Green; border-width: 3px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr></table></div></div>\n            </div></div>",
            collapsable: false,
            collapsed: false,
            children: [],
          },
          {
            innerHTML:
              "<div id=\"node63dbc9c0-bc9f-11eb-a248-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>7, 8</div>\n            <div class=node-content\n            style='max-width:600px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>1</th></tr><tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>●</th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr></table></div><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr><tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>1</th></tr><tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>●</th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr></table></div></div>\n            </div></div>",
            collapsable: false,
            collapsed: false,
            children: [
              {
                innerHTML:
                  '<div id="node63dbc9bf-bc9f-11eb-91ff-dc7196dd2d0d"\n                data-toggle="tooltip"><div class="and-gate" id=63dbc9bf-bc9f-11eb-91ff-dc7196dd2d0d style="">x</div></div>',
                collapsable: true,
                collapsed: false,
                children: [
                  {
                    innerHTML:
                      "<div id=\"node63dbc9bd-bc9f-11eb-9da9-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>6</div>\n            <div class=node-content\n            style='max-width:300px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr><tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>1</th></tr></table></div></div>\n            </div></div>",
                    collapsable: false,
                    collapsed: false,
                    children: [
                      {
                        innerHTML:
                          '<div id="node63dba2b5-bc9f-11eb-87d5-dc7196dd2d0d"\n                data-toggle="tooltip"><div class="and-gate" id=63dba2b5-bc9f-11eb-87d5-dc7196dd2d0d style="">+</div></div>',
                        collapsable: true,
                        collapsed: false,
                        children: [
                          {
                            innerHTML:
                              "<div id=\"node63db54a1-bc9f-11eb-af85-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>1</div>\n            <div class=node-content\n            style='max-width:300px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>1</th></tr></table></div></div>\n            </div></div>",
                            collapsable: false,
                            collapsed: false,
                            children: [],
                          },
                          {
                            innerHTML:
                              "<div id=\"node63dba2b4-bc9f-11eb-826f-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>5</div>\n            <div class=node-content\n            style='max-width:300px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>●</th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr><tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr><tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th></tr></table></div></div>\n            </div></div>",
                            collapsable: false,
                            collapsed: false,
                            children: [
                              {
                                innerHTML:
                                  '<div id="node63dba2b3-bc9f-11eb-b54b-dc7196dd2d0d"\n                data-toggle="tooltip"><div class="and-gate" id=63dba2b3-bc9f-11eb-b54b-dc7196dd2d0d style="">x</div></div>',
                                collapsable: true,
                                collapsed: false,
                                children: [
                                  {
                                    innerHTML:
                                      "<div id=\"node63dba2b0-bc9f-11eb-a5da-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>2</div>\n            <div class=node-content\n            style='max-width:300px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th></tr></table></div></div>\n            </div></div>",
                                    collapsable: false,
                                    collapsed: false,
                                    children: [
                                      {
                                        innerHTML:
                                          '<div id="node63dba2af-bc9f-11eb-b61c-dc7196dd2d0d"\n                data-toggle="tooltip"><div class="and-gate" id=63dba2af-bc9f-11eb-b61c-dc7196dd2d0d style="">+</div></div>',
                                        collapsable: true,
                                        collapsed: false,
                                        children: [
                                          {
                                            innerHTML:
                                              "<div id=\"node63db7b81-bc9f-11eb-b8d8-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style='border-color: Green; border-width: 3px;'><div class=label\n            style='border-color: Green; border-width: 3px;background-color: #89d75d;'>0</div>\n            <div class=node-content\n            style='max-width:300px;border-color: Green; border-width: 3px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr></table></div></div>\n            </div></div>",
                                            collapsable: false,
                                            collapsed: false,
                                            children: [],
                                          },
                                          {
                                            innerHTML:
                                              "<div id=\"node63dba2ae-bc9f-11eb-bb46-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>4</div>\n            <div class=node-content\n            style='max-width:300px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>●</th></tr><tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '> </th></tr></table></div></div>\n            </div></div>",
                                            collapsable: false,
                                            collapsed: false,
                                            children: [
                                              {
                                                innerHTML:
                                                  '<div id="node63db7b84-bc9f-11eb-8f1d-dc7196dd2d0d"\n                data-toggle="tooltip"><div class="and-gate" id=63db7b84-bc9f-11eb-8f1d-dc7196dd2d0d style="">x</div></div>',
                                                collapsable: true,
                                                collapsed: false,
                                                children: [
                                                  {
                                                    innerHTML:
                                                      "<div id=\"node63db7b82-bc9f-11eb-8b8a-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>2</div>\n            <div class=node-content\n            style='max-width:300px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th></tr></table></div></div>\n            </div></div>",
                                                    collapsable: false,
                                                    collapsed: false,
                                                    children: [],
                                                  },
                                                  {
                                                    innerHTML:
                                                      "<div id=\"node63db7b83-bc9f-11eb-bc58-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style='border-color: Green; border-width: 3px;'><div class=label\n            style='border-color: Green; border-width: 3px;background-color: #89d75d;'>3</div>\n            <div class=node-content\n            style='max-width:300px;border-color: Green; border-width: 3px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>●</th></tr></table></div></div>\n            </div></div>",
                                                    collapsable: false,
                                                    collapsed: false,
                                                    children: [],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    innerHTML:
                                      "<div id=\"node63dba2b1-bc9f-11eb-94ef-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style='border-color: Green; border-width: 3px;'><div class=label\n            style='border-color: Green; border-width: 3px;background-color: #89d75d;'>3</div>\n            <div class=node-content\n            style='max-width:300px;border-color: Green; border-width: 3px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>●</th></tr></table></div></div>\n            </div></div>",
                                    collapsable: false,
                                    collapsed: false,
                                    children: [],
                                  },
                                  {
                                    innerHTML:
                                      "<div id=\"node63dba2b2-bc9f-11eb-8ed0-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style=''><div class=label\n            style=''>2</div>\n            <div class=node-content\n            style='max-width:300px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>/</th></tr></table></div></div>\n            </div></div>",
                                    collapsable: false,
                                    collapsed: false,
                                    children: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    innerHTML:
                      "<div id=\"node63dbc9be-bc9f-11eb-943a-dc7196dd2d0d\" data-toggle=\"tooltip\"><div class=node-container style='border-color: Green; border-width: 3px;'><div class=label\n            style='border-color: Green; border-width: 3px;background-color: #89d75d;'>3</div>\n            <div class=node-content\n            style='max-width:300px;border-color: Green; border-width: 3px;'><div class=inner-node-content style=\"\">\n                <table> <tr><th style='\n            border: 1px solid;\n            width: 24px;\n            height: 24px;\n            text-align: center;\n            '>●</th></tr></table></div></div>\n            </div></div>",
                    collapsable: false,
                    collapsed: false,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  tooltips: [
    {
      content:
        '\n                <p>Labels: 0</p>\n                <pre>+-+<br>| |<br>+-+<br></pre>\n                <p>Verified: is atom</p>',
      selector: '#node63db54a0-bc9f-11eb-8527-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 1</p>\n                <pre>+-+<br>|1|<br>+-+<br>1: Av(102, 210)<br></pre>\n                ',
      selector: '#node63db54a1-bc9f-11eb-af85-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 0</p>\n                <pre>+-+<br>| |<br>+-+<br></pre>\n                <p>Verified: is atom</p>',
      selector: '#node63db7b81-bc9f-11eb-b8d8-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 2</p>\n                <pre>+-+<br>|/|<br>+-+<br>/: Av(10)<br></pre>\n                ',
      selector: '#node63db7b82-bc9f-11eb-8b8a-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 3</p>\n                <pre>+-+<br>|●|<br>+-+<br>●: point<br>Requirement 0:<br>0: (0, 0)</pre>\n                <p>Verified: is atom</p>',
      selector: '#node63db7b83-bc9f-11eb-bc58-dc7196dd2d0d',
    },
    {
      content: '<p>Formal step:<br/>factor with partition {(0, 0)} / {(1, 1)}</p>',
      selector: '#node63db7b84-bc9f-11eb-8f1d-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 4</p>\n                <pre>+-+-+<br>| |●|<br>+-+-+<br>|/| |<br>+-+-+<br>/: Av(10)<br>●: point<br>Requirement 0:<br>0: (1, 1)</pre>\n                ',
      selector: '#node63dba2ae-bc9f-11eb-bb46-dc7196dd2d0d',
    },
    {
      content: '<p>Formal step:<br/>placing the topmost point in cell (0, 0)</p>',
      selector: '#node63dba2af-bc9f-11eb-b61c-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 2</p>\n                <pre>+-+<br>|/|<br>+-+<br>/: Av(10)<br></pre>\n                ',
      selector: '#node63dba2b0-bc9f-11eb-a5da-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 3</p>\n                <pre>+-+<br>|●|<br>+-+<br>●: point<br>Requirement 0:<br>0: (0, 0)</pre>\n                <p>Verified: is atom</p>',
      selector: '#node63dba2b1-bc9f-11eb-94ef-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 2</p>\n                <pre>+-+<br>|/|<br>+-+<br>/: Av(10)<br></pre>\n                ',
      selector: '#node63dba2b2-bc9f-11eb-8ed0-dc7196dd2d0d',
    },
    {
      content: '<p>Formal step:<br/>factor with partition {(0, 1)} / {(1, 2)} / {(2, 0)}</p>',
      selector: '#node63dba2b3-bc9f-11eb-b54b-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 5</p>\n                <pre>+-+-+-+<br>| |●| |<br>+-+-+-+<br>|/| | |<br>+-+-+-+<br>| | |/|<br>+-+-+-+<br>/: Av(10)<br>●: point<br>Requirement 0:<br>0: (1, 2)</pre>\n                ',
      selector: '#node63dba2b4-bc9f-11eb-826f-dc7196dd2d0d',
    },
    {
      content: '<p>Formal step:<br/>placing the topmost point in cell (0, 1)</p>',
      selector: '#node63dba2b5-bc9f-11eb-87d5-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 6</p>\n                <pre>+-+-+<br>|/| |<br>+-+-+<br>| |1|<br>+-+-+<br>/: Av(10)<br>1: Av(102, 210)<br>Crossing obstructions:<br>210: (0, 1), (1, 0), (1, 0)<br></pre>\n                ',
      selector: '#node63dbc9bd-bc9f-11eb-9da9-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 3</p>\n                <pre>+-+<br>|●|<br>+-+<br>●: point<br>Requirement 0:<br>0: (0, 0)</pre>\n                <p>Verified: is atom</p>',
      selector: '#node63dbc9be-bc9f-11eb-943a-dc7196dd2d0d',
    },
    {
      content: '<p>Formal step:<br/>factor with partition {(0, 2), (2, 1)} / {(1, 0)}</p>',
      selector: '#node63dbc9bf-bc9f-11eb-91ff-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 7, 8</p>\n                <pre>row and column separation<br>+-+-+-+                         +-+-+-+                    <br>|/| |1|                      =  |/| | |                    <br>+-+-+-+                         +-+-+-+                    <br>| |●| |                         | | |1|                    <br>+-+-+-+                         +-+-+-+                    <br>/: Av(10)                       | |●| |                    <br>1: Av(102, 210)                 +-+-+-+                    <br>●: point                        /: Av(10)                  <br>Crossing obstructions:          1: Av(102, 210)            <br>01: (0, 1), (2, 1)              ●: point                   <br>210: (0, 1), (2, 1), (2, 1)     Crossing obstructions:     <br>Requirement 0:                  210: (0, 2), (2, 1), (2, 1)<br>0: (1, 0)                       Requirement 0:             <br>                                0: (1, 0)                  </pre>\n                ',
      selector: '#node63dbc9c0-bc9f-11eb-a248-dc7196dd2d0d',
    },
    {
      content: '<p>Formal step:<br/>placing the bottommost point in cell (0, 0)</p>',
      selector: '#node63dbf0bb-bc9f-11eb-9de6-dc7196dd2d0d',
    },
    {
      content:
        '\n                <p>Labels: 1</p>\n                <pre>+-+<br>|1|<br>+-+<br>1: Av(102, 210)<br></pre>\n                ',
      selector: '#node63dbf0bc-bc9f-11eb-bf8f-dc7196dd2d0d',
    },
  ],
  chart: {
    maxDepth: 10000,
    container: '#spec-tree0',
    connectors: { type: 'bCurve', style: {} },
    nodeAlign: 'BOTTOM',
    levelSeparation: 35,
    siblingSeparation: 30,
    connectorsSpeed: 10,
    animation: { nodeSpeed: 400, connectorsSpeed: 200 },
  },
};
const tree = new Treant(simple);
console.log(tree !== null);

$('#node63db54a0-bc9f-11eb-8527-dc7196dd2d0d').on('click', () => {
  console.log('yo');
});

if (false) {
  setTimeout(() => {
    tree.destroy();
  }, 2000);
}

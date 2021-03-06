// Some of these might not be jsdoc compliant but will work for the vs code intellisense.

/**
 * @typedef GriddedPermJson
 * @property {number[]} patt
 * @property {number[][]} pos
 */

/**
 * @typedef AssumptionJson
 * @property {'tilings.assumptions'} class_module
 * @property {'TrackingAssumption'} comb_class
 * @property {GriddedPermJson[]} gps
 */

/**
 * @typedef TilingJson
 * @property {'tilings.tiling'} class_module
 * @property {'Tiling'} comb_class
 * @property {GriddedPermJson[]} obstructions
 * @property {GriddedPermJson[][]} requirements
 * @property {AssumptionJson[]} assumptions
 */

/**
 * @typedef TilingPlot
 * @property {string[][]} assumptions
 * @property {string[]} crossing
 * @property {Object.<string,string>} label_map
 * @property {string[][]} matrix
 * @property {string[][]} requirements
 */

/**
 * @typedef VerificationRule
 * @property {string} class_module
 * @property {string} strategy_class
 * @property {object} strategy
 * @property {string} formal_step
 */

/**
 * @typedef TilingResponse
 * @property {string} key
 * @property {TilingPlot} plot
 * @property {null|VerificationRule} verified
 */

/**
 * @typedef TilingInterface
 * @property {string} key
 * @property {TilingPlot} plot
 * @property {null|VerificationRule} verified
 * @property {() => boolean} isVerified
 * @property {() => string} asciiHTML
 */

/**
 * @typedef OriginalRule
 * @property {string} class_module
 * @property {string} rule_class
 * @property {object} strategy
 * @property {string[]} children
 */

/**
 * @typedef RuleResponse
 * @property {TilingResponse[]} children
 * @property {string} class_module
 * @property {string} formal_step
 * @property {string} op
 * @property {string} rule_class
 * @property {object} strategy
 * @property {undefined|OriginalRule} original_rule
 */

/**
 * @typedef {Promise.<{status: number, data: null|RuleResponse}>} RuleResponsePromise
 */

/**
 * @typedef RuleWithoutTilings
 * @property {string} op
 * @property {string} formalStep
 * @property {string} ruleClass
 * @property {string} classModule
 * @property {object} strategy
 * @property {number[]} children
 * @property {undefined|OriginalRule} originalRule
 */

/**
 * @typedef RuleInterface
 * @property {string} formalStep
 * @property {TilingInterface[]} children
 * @property {string} ruleClass
 * @property {string} classModule
 * @property {object} strategy
 * @property {string} op
 * @property {object|OriginalRule} originalRule
 * @property {(childrenIds: number[]) => RuleWithoutTilings} withoutTilings
 */

/**
 * @typedef AppStateInterface
 * @property {{dir: 'n'|'w'|'s'|'e', row: boolean}} rowColPlace
 * @property {{patt: string}} cellInsert
 * @property {{dir: 'n'|'w'|'s'|'e', idx: number}} reqPlace
 * @property {{row: boolean}} fusion
 * @property {{atom: boolean, locallyFactorable: boolean, insertionEncodable: boolean, oneByOne: boolean, subclass: boolean, shortObstruction: boolean, root: string[]}} verificationStrategies
 * @property {{json: boolean}} clipboard
 * @property {(patt: string) => void} setCellInsertPatt
 * @property {() => string} getCellInsertPatt
 * @property {(dir: 'n'|'w'|'s'|'e') => void} setRowColPlacementDirection
 * @property {() => 'n'|'w'|'s'|'e'} getRowColPlacementDirection
 * @property {(row: boolean) => void} setRowColPlacementRow
 * @property {() => boolean} getRowColPlacementRow
 * @property {(dir: 'n'|'w'|'s'|'e') => void} setReqPlacementDirection
 * @property {() => 'n'|'w'|'s'|'e'} getReqPlacementDirection
 * @property {(idx: number) => void} setReqPlacementIdx
 * @property {() => number} getReqPlacementIdx
 * @property {(row: boolean) => void} setFusionRow
 * @property {() => boolean} getFusionRow
 * @property {(on: boolean) => void} setAtomVerification
 * @property {() => boolean} getAtomVerification
 * @property {(on: boolean) => void} setLocallyFactorableVerification
 * @property {() => boolean} getLocallyFactorableVerification
 * @property {(on: boolean) => void} setInsertionEncodableVerification
 * @property {() => boolean} getInsertionEncodableVerification
 * @property {(on: boolean) => void} setOneByOneVerifciation
 * @property {() => boolean} getOneByOneVerifciation
 * @property {(on: boolean) => void} setSubclassVerification
 * @property {() => boolean} getSubclassVerification
 * @property {(on: boolean) => void} setShortObstructionVerification
 * @property {() => boolean} getShortObstructionVerification
 * @property {(basis: string[]) => void} setRootBasis
 * @property {() => string[]} getRootBasis
 * @property {(json: boolean) => void} setClipboardCopy
 * @property {() => boolean} getClipboardCopy
 */

/**
 * @typedef ErrorDisplayInterface
 * @property {(msg: string, success: boolean=) => void} alert
 * @property {() => void} notImplemented
 * @property {(newParent: JQuery) => void} moveToParent
 * @property {() => void} restoreParent
 */

/**
 * @typedef TreantNodeData
 * @property {string} innerHTML
 * @property {boolean} collapsable
 * @property {boolean} collapsed
 */

/**
 * @typedef ClassToAlternative
 * @property {(id: number) => number} get
 * @property {(id: number, value: number) => void} set
 * @property {(id: number) => boolean} contains
 * @property {Object.<number,number>} data
 */

/**
 * @typedef VerifyTactics
 * @property {number[]} strats
 * @property {string[]} basis
 */

/**
 * @typedef Dictionary
 * @property {(key: any, value: any) => void} set
 * @property {(key: any) => any } get
 * @property {(key: any) => boolean} contains
 */

/**
 * @typedef Queue
 * @property {(item: any) => void} enqueue
 * @property {() => any} dequeue
 * @property {() => boolean} isEmpty
 */

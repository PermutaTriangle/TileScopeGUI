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
 * @typedef VerificationStrategy
 * @property {'tilings.strategies.verification'} class_module
 * @property {string} strategy_class
 */

/**
 * @typedef VerificationRuleResponse
 * @property {'comb_spec_searcher.strategies.rule'} class_module
 * @property {TilingJson} comb_class
 * @property {string} formal_step
 * @property {'VerificationRule'} rule_class
 * @property {} strategy
 */

/**
 * @typedef TilingResponse
 * @property {string} key
 * @property {TilingPlot} plot
 * @property {TilingJson} tiling
 * @property {null|VerificationStrategy} verified
 */

/**
 * @typedef TilingInterface
 * @property {string} key
 * @property {TilingPlot} plot
 * @property {TilingJson} tiling
 * @property {null|VerificationStrategy} verified
 * @property {() => boolean} isVerified
 * @property {() => string} asciiHTML
 * @property {() => TilingJson} getTilingObject
 */

/**
 * @typedef RuleResponse
 * @property {TilingResponse[]} children
 * @property {string} class_module
 * @property {string} formal_step
 * @property {string} op
 * @property {string} rule_class
 * @property {object} strategy
 */

/**
 * @typedef {Promise.<{status: number, data: null|RuleResponse}>} RuleResponsePromise
 */

/**
 * @typedef RuleWithoutTilings
 * @property {string} formalStep
 * @property {string} ruleClass
 * @property {string} classModule
 * @property {object} strategy
 * @property {number[]} children
 */

/**
 * @typedef RuleInterface
 * @property {string} formalStep
 * @property {TilingInterface[]} children
 * @property {string} ruleClass
 * @property {string} classModule
 * @property {object} strategy
 * @property {string} op
 * @property {(childrenIds: number[]) => RuleWithoutTilings} withoutTilings
 */

/**
 * @typedef AppStateInterface
 * @property {{dir: 'n'|'w'|'s'|'e', row: boolean}} rowColPlace
 * @property {{patt: string}} cellInsert
 * @property {{dir: 'n'|'w'|'s'|'e', idx: number}} reqPlace
 * @property {{row: boolean}} fusion
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
 */

/**
 * @typedef ErrorDisplayInterface
 * @property {(msg: string, success: boolean=) => void} alert
 * @property {() => void} notImplemented
 * @property {(newParent: JQuery) => void} moveToParent
 * @property {() => void} restoreParent
 */
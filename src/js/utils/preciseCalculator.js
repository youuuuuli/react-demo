import DefaultBigNumber from 'bignumber.js';

/**
 * 精確計算器
 *
 * @param {DefaultBigNumber.Config} [config] 計算機設定
 * @returns {object} Calculate Function
 */
function preciseCalculator(config) {
  const BigNumber = DefaultBigNumber.clone(config);

  /**
   * @typedef {InstanceType<typeof DefaultBigNumber>} BigNumberInstance
   */

  /**
   * 反序列化
   *
   * @private
   * @param {any} value 值
   * @returns {BigNumberInstance} 轉化結果
   */
  function deserialize(value) {
    return new BigNumber(value);
  }

  /**
   * 序列化
   *
   * @private
   * @param {BigNumberInstance} value 值
   * @returns {number} 轉化結果
   */
  function serialize(value) {
    if (value.isNaN()) {
      return Number.NaN;
    }

    return value.toString();
  }

  /**
   * 轉成數字
   *
   * @param {string} value 值
   * @param {number} [defaultValue] 預設值
   * @returns {number} 轉換結果
   */
  function toNumeric(value, defaultValue) {
    let result = deserialize(value);

    if (defaultValue !== undefined && result.isNaN()) {
      result = deserialize(defaultValue);
    }

    return serialize(result);
  }

  /**
   * 是否為數字或數字字串
   *
   * @param {any} value 值
   * @returns {boolean} 是否為數字或數字字串
   */
  function isNumeric(value) {
    return !deserialize(value).isNaN();
  }

  /**
   * 加
   *
   * @param  {number} augend 被加數
   * @param  {number} addend 加數
   * @returns {number} 和
   */
  function add(augend, addend) {
    return serialize(deserialize(augend).plus(addend));
  }

  /**
   * 減
   *
   * @param  {number} minuend 被減數
   * @param  {number} subtrahend 減數
   * @returns {number} 差
   */
  function subtract(minuend, subtrahend) {
    return serialize(deserialize(minuend).minus(subtrahend));
  }

  /**
   * 乘
   *
   * @param  {number} multiplicand 被乘數
   * @param  {number} multiplier 乘數
   * @returns {number} 積
   */
  function multiply(multiplicand, multiplier) {
    return serialize(deserialize(multiplicand).multipliedBy(multiplier));
  }

  /**
   * 除
   *
   * @param  {number} dividend 被除數
   * @param  {number} divisor 除數
   * @returns {number} 商
   */
  function divide(dividend, divisor) {
    return serialize(deserialize(dividend).dividedBy(divisor));
  }

  /**
   * 比較運算
   *
   * @param  {number} valueA 值A
   * @param {string} operator 運算子
   * @param  {number} valueB 值B
   * @returns {boolean} 比較結果
   */
  function compare(valueA, operator, valueB) {
    switch (operator) {
      case '<':
        return isLessThan(valueA, valueB);
      case '<=':
        return isLessThanOrEqualTo(valueA, valueB);
      case '==':
        return isEqualTo(valueA, valueB);
      case '!=':
        return isNotEqualTo(valueA, valueB);
      case '>':
        return isGreaterThan(valueA, valueB);
      case '>=':
        return isGreaterThanOrEqualTo(valueA, valueB);
      default:
        /** @type {never} */
        // eslint-disable-next-line no-case-declarations
        const invalidOperator = operator;

        throw new RangeError(`Invalid operator: ${invalidOperator}`);
    }
  }

  /**
   * 小於
   *
   * @param  {number} valueA 值A
   * @param  {number} valueB 值B
   * @returns {boolean} 是否小於
   */
  function isLessThan(valueA, valueB) {
    return deserialize(valueA).isLessThan(valueB);
  }

  /**
   * 小於等於
   *
   * @param  {number} valueA 值A
   * @param  {number} valueB 值B
   * @returns {boolean} 是否小於等於
   */
  function isLessThanOrEqualTo(valueA, valueB) {
    return deserialize(valueA).isLessThanOrEqualTo(valueB);
  }

  /**
   * 等於
   *
   * @param  {number} valueA 值A
   * @param  {number} valueB 值B
   * @returns {boolean} 是否等於
   */
  function isEqualTo(valueA, valueB) {
    return deserialize(valueA).isEqualTo(valueB);
  }

  /**
   * 不等於
   *
   * @param  {number} valueA 值A
   * @param  {number} valueB 值B
   * @returns {boolean} 是否不等於
   */
  function isNotEqualTo(valueA, valueB) {
    return !deserialize(valueA).isEqualTo(valueB);
  }

  /**
   * 大於
   *
   * @param  {number} valueA 值A
   * @param  {number} valueB 值B
   * @returns {boolean} 是否大於
   */
  function isGreaterThan(valueA, valueB) {
    return deserialize(valueA).isGreaterThan(valueB);
  }

  /**
   * 大於等於
   *
   * @param  {number} valueA 值A
   * @param  {number} valueB 值B
   * @returns {boolean} 是否大於等於
   */
  function isGreaterThanOrEqualTo(valueA, valueB) {
    return deserialize(valueA).isGreaterThanOrEqualTo(valueB);
  }

  /**
   * 向下取整
   *
   * @param {number} value 值
   * @returns {number} 整數
   */
  function floor(value) {
    return serialize(deserialize(value).integerValue(BigNumber.ROUND_FLOOR));
  }

  /**
   * 向上取整
   *
   * @param {number} value 值
   * @returns {number} 整數
   */
  function ceil(value) {
    return serialize(deserialize(value).integerValue(BigNumber.ROUND_CEIL));
  }

  /**
   * 取絕對值
   *
   * @param {number} value 值
   * @returns {number} 絕對值
   */
  function abs(value) {
    return serialize(deserialize(value).absoluteValue());
  }

  /**
   * 取得最小值
   *
   * @param {...number} values 值
   * @returns {number} 最小值
   */
  function min(...values) {
    return serialize(BigNumber.minimum(...values));
  }

  /**
   * 取得最大值
   *
   * @param {...number} values 值
   * @returns {number} 最大值
   */
  function max(...values) {
    return serialize(BigNumber.maximum(...values));
  }

  /**
   * 加總
   *
   * @param {...number} values 值
   * @returns {number} 總和
   */
  function sum(...values) {
    return serialize(BigNumber.sum(...values));
  }

  /**
   * 返回無條件捨去到小數點後第 N 位的定點數字串
   *
   * @param {number} value 值；若傳入非數字，則使用 `0` 做處理
   * @param {number} n N
   * @returns {string} 轉化結果
   */
  function toRoundDownFixed(value, n) {
    let result = deserialize(0);

    const realValue = deserialize(value);

    if (!realValue.isNaN()) {
      result = realValue;
    }

    return result.toFixed(n, BigNumber.ROUND_DOWN);
  }

  /**
   * 無條件捨去成 N 的倍數
   *
   * @param {number} value 值
   * @param {number} n N
   * @returns {number} 轉化結果
   */
  function roundDownToMultipleOf(value, n) {
    const valueN = deserialize(n);

    if (valueN.isLessThanOrEqualTo(0)) {
      throw new RangeError(`Invalid multiple: ${n}`);
    }

    return serialize(
      deserialize(value).dividedToIntegerBy(valueN).multipliedBy(valueN),
    );
  }

  /**
   * 取倒數
   *
   * @param {number} n 值
   * @returns {number} 轉化結果
   */
  function reciprocal(n) {
    return divide(1, n);
  }

  /**
   * 取絕對值後相加
   *
   * @param {number} n1 值
   * @param {number} n2 值
   * @returns {number} 轉化結果
   */
  function addAbs(n1, n2) {
    return add(abs(n1), abs(n2));
  }

  return {
    deserialize,
    toNumeric,
    isNumeric,
    add,
    subtract,
    multiply,
    divide,
    isLessThan,
    isLessThanOrEqualTo,
    isEqualTo,
    isNotEqualTo,
    isGreaterThan,
    isGreaterThanOrEqualTo,
    compare,
    floor,
    ceil,
    abs,
    min,
    max,
    sum,
    toRoundDownFixed,
    roundDownToMultipleOf,
    reciprocal,
    addAbs,
  };
}

export default preciseCalculator;

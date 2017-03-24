/**
 * Created by out_xu on 17/2/21.
 */
import { SET_CONTESTS_TABLE, GET_CONTEST_SUCC, GET_CONTEST_ERR } from './type';
import API from '../api';
import goto from '../utils/goto';
import * as requestService from '../utils/request';
import jumpTo from '../utils/windowScroll';


/**
 * 设置竞赛列表
 * @param data
 */
const setContestsList = data => ({
  type: SET_CONTESTS_TABLE,
  payload: {
    data
  }
});

/**
 * 设置当前竞赛详情
 * @param data
 */
const getContestSucc = data => ({
  type: GET_CONTEST_SUCC,
  payload: {
    data
  }
});

const getContestErr = () => ({
  type: GET_CONTEST_ERR,
  payload: {}
});

/**
 * 获取竞赛列表
 * @param page 页码
 * @param size 条数
 * @returns {function(*)} dispatch action
 */
export function getContestsTable(page = 1, size = 20) {
  return async (dispatch) => {
    try {
      const params = {
        page,
        size
      };
      const json = await requestService.get(API.contests, params);
            // 将当前输入的页码存入sessionStorage
      sessionStorage.setItem('neuq_oj.contestspagecurr', page);
      sessionStorage.setItem('neuq_oj.contestspagesize', size);
      sessionStorage.setItem('neuq_oj.contestspagecount', json.total_count);

      await dispatch(setContestsList(json.data));

      jumpTo('navigation');
    } catch (e) {
      console.error(e);
    }
  };
}


/**
 * 搜索竞赛
 * @param value 搜索字段
 * @param page 页码
 * @param size 条数
 * @returns {function(*)} dispatch action
 */
export function searchContests(value, page = 1, size = 20) {
  return async (dispatch) => {
    try {
      const params = {
        keyword: value,
        page,
        size
      };
      const json = await requestService.get(API.contestssearch, params);

      sessionStorage.setItem('neuq_oj.contestspagecurr', page);
      sessionStorage.setItem('neuq_oj.contestspagesize', size);
      sessionStorage.setItem('neuq_oj.contestspagecount', json.total_count);

      await dispatch(setContestsList(json.data));

      jumpTo('navigation');
    } catch (e) {
      console.error(e);
    }
  };
}


/**
 * 获取竞赛问题
 * @param id 问题ID
 * @returns {function(*)} dispatch action
 */
export function getContest(id) {
  return async (dispatch) => {
    try {
      const json = await requestService.tget(API.contest + id);
      await dispatch(getContestSucc(json.data));
      jumpTo('navigation');
    } catch (e) {
      dispatch(getContestErr());
      goto('/contests');
      console.error(e);
    }
  };
}


/**
 * 加入竞赛
 * @param id 竞赛ID
 * @param body 验证密码
 * @returns {function()}
 */
export function joinContest(id, body) {
  return async () => {
    try {
      const url = `${API.contest + id}/join`;
      await requestService.tpost(url, body);
      await getContest(id);
      await goto(`contests/${id}`);
    } catch (e) {
      goto('/contests');
    }
  };
}

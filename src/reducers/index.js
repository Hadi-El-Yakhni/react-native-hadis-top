import { combineReducers } from 'redux'
import AuthReducer from './AuthReducer'
import ToDoReducer from './ToDoReducer'
import EmployeesReducer from './EmployeesReducer'
import MoneyReducer from './MoneyReducer'
import AppReducer from './AppReducer'

export default combineReducers({
  auth: AuthReducer,
  todo: ToDoReducer,
  employees: EmployeesReducer,
  money: MoneyReducer,
  app: AppReducer
})
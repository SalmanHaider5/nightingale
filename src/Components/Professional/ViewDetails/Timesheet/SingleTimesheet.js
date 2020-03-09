import React from 'react'
import moment from 'moment'
import { isNil, prop, isEmpty } from 'ramda'
import { Card, List, Switch, Icon, Popconfirm } from 'antd'
import { DATE_FORMAT as dateFormat } from '../../../../constants'

const SingleTimesheet = ({
  days,
  timesheet,
  getTimesheetShiftByDay,
  deleteTimesheet,
  changeShiftAvailability,
  showEditShiftModal
}) => {
  const { startingDay, endingDay } = timesheet
  return (
    <Card
      className="timesheet-card"
      title={`${moment(startingDay).format(dateFormat)} - ${moment(endingDay).format(dateFormat)}`}
      extra={
        <>
          <Popconfirm
            title="Are you sure to delete this timesheet?"
            onConfirm={() => deleteTimesheet(timesheet.id)}
            okText="Yes"
            cancelText="No"
          >
            <Icon
              type="delete"
              theme="filled"
            />
          </Popconfirm>
        </>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={days}
        renderItem={day => {
          const schedule = getTimesheetShiftByDay(timesheet, day)
          
          return (
            <List.Item>
              <List.Item.Meta
                title={day.name}
                description={<span>{prop('date', schedule)}</span>}
                
              />
              <div style={{width: '185px'}}>
                <h4 >
                  <Switch
                    id={{ id: schedule.id, timesheet: timesheet.id}}
                    defaultChecked={schedule.status ? true : false}
                    disabled={isEmpty(schedule.name)  ? true : false}
                    onChange={(checked) => changeShiftAvailability(checked, schedule.id, timesheet.id)}
                  />
                </h4>
                <span style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)'}}>
                  {schedule.status ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div style={{textAlign: 'center', paddingRight: '50px'}}>
                <h4 style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)'}}>
                  { isNil(schedule) ? '-' : prop('name', schedule) }
                </h4>
                <span style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)'}}>
                  { isNil(schedule) ? '00:00 AA - 00:00 AA' : `${prop('time', schedule)}` }
                </span>
              </div>
              <Icon type="edit" style={{ fontSize: '26px' }} onClick={() => showEditShiftModal(timesheet.id, schedule.id)} />
            </List.Item>
          )
        }}
      />
    </Card>
  )
}
export default SingleTimesheet

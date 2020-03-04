import React from 'react'
import moment from 'moment'
import { isNil, prop } from 'ramda'
import { Card, List, Switch, Icon, Popconfirm } from 'antd'

const SingleTimesheet = ({ days, timesheet, getTimesheetShiftByDay, deleteTimesheet }) => {
  console.log(timesheet)
  return (
    <Card
      className="timesheet-card"
      title={`Week ${timesheet.id}`}
      extra={
        <>
          <Icon type="edit" />
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
        renderItem={item => {
          const schedule = getTimesheetShiftByDay(timesheet.id, item.id)
          console.log('Schedule', schedule)
          return (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={isNil(schedule) ? '00/00/00000' : `${moment(prop('date', schedule)).format('L')}`}
              />
              <div style={{textAlign: 'center', paddingRight: '50px'}}>
                <h4 style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)'}}>
                  { isNil(schedule) ? '-' : prop('shift', schedule) }
                </h4>
                <span style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)'}}>
                  { isNil(schedule) ? '00:00 AA - 00:00 AA' : `${prop('time', schedule)}` }
                </span>
              </div>
              <Switch
                defaultChecked={isNil(schedule) ? false : true }
                disabled={isNil(schedule) ? true : false }
              />
            </List.Item>
          )
        }}
      />
    </Card>
  )
}
export default SingleTimesheet

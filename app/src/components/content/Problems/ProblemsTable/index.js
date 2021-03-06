/**
 * Created by out_xu on 17/1/3.
 */
import React from 'react'
import { Link } from 'react-router'
import QueueAnim from 'rc-queue-anim'
import { Icon, Input, Table, Tag } from 'antd'
import { color } from 'utils'
import './index.less'

const Search = Input.Search
class ProblemsTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  componentDidMount () {
    const page = window.sessionStorage.getItem('neuq_oj.problempagecurr') || 1
    const size = window.sessionStorage.getItem('neuq_oj.problempagesize') || 20
    this.props.getProblemTable(page, size)
  }

  onInputChange (e) {
    this.setState({searchText: e.target.value})
  }

  onSearch () {
    const searchText = encodeURIComponent(this.state.searchText)
    if (searchText.length < 1) {
      const page = 1
      const size = window.sessionStorage.getItem('neuq_oj.problempagesize')
      this.props.getProblemTable(page, size)
    } else {
      this.props.searchProblems(searchText)
    }
  }

  // 正确率
  render () {
    const {data} = this.props
    const difficultyArr = ['简单', '一般', '困难']
    const accepted = {
      Y: <Icon className='status-yes' type='check-circle' />,
      N: <Icon className='status-no' type='close-circle' />
    }
    const colorArr = {
      1: color.blue,
      2: color.red,
      3: color.purple,
      4: color.yellow,
      5: color.sky
    }
    const randomN = () => Math.floor(Math.random() * 5 + 1)
    const columns = [{
      title: '',
      width: '1%',
      key: 'problem-none',
      className: 'problem-none'
    }, {
      title: '状态',
      render: (record) => {
        const status = record.user_status
        if (status === 'Y') {
          return accepted.Y
        } else if (status === 'N') {
          return accepted.N
        }
        return null
      },
      width: 40,
      key: 'problem-status',
      className: 'problem-status'
    }, {
      title: '#',
      render: record =>
        (<span>
          <Link to={`problems/${record.id}`}> {record.id}</Link>
        </span>),
      key: 'problem-id',
      width: 60,
      className: 'problem-id'
    }, {
      title: '难度',
      render: record => (
        <span >
          {difficultyArr[record.difficulty - 1]}
        </span>
        // new Array(record.difficulty).fill(<Icon type="star-o" />)
      ),
      filters: [
        {text: '简单', value: 1},
        {text: '一般', value: 2},
        {text: '困难', value: 3}
      ],
      onFilter: (value, record) => record.difficulty === Number(value),
      width: 60,
      key: 'problem-diff'
    }, {
      title: '标题',
      render: record =>
        (<span>
          <span >{// 标签渲染
            record.tags && (record.tags.map((value, index) => (
              <Tag color={colorArr[randomN()]} key={index + 400} className='problem-title-tags'>{value.tag_title}
              </Tag>
            )))}
          </span>
          <div className='problem-title-content'>
            <Link to={`problems/${record.id}`}> {record.title}</Link>
          </div>
        </span>),
      key: 'problem-title',
      className: 'problem-title'
    }, {
      title: '来源',
      dataIndex: 'source',
      key: 'problem-source'
    }, {
      title: '提交',
      dataIndex: 'submit',
      sorter: (a, b) => a.submit - b.submit,
      width: 80,
      key: 'problem-problemsubmit'
    }, {
      title: '正确',
      dataIndex: 'accepted',
      sorter: (a, b) => a.accept - b.accept,
      width: 60,
      key: 'problem-accept'
    }]
    const pagination = {
      pageSize: Number(window.sessionStorage.getItem('neuq_oj.problempagesize')),
      current: Number(window.sessionStorage.getItem('neuq_oj.problempagecurr')),
      total: Number(window.sessionStorage.getItem('neuq_oj.problempagecount')),
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => {
        const searchText = encodeURIComponent(this.state.searchText)
        if (searchText.length < 1) {
          this.props.getProblemTable(current, pageSize)
        } else {
          this.props.searchProblems(searchText, current, pageSize)
        }
      },
      onChange: (current) => {
        window.sessionStorage.setItem('neuq_oj.problempagecurr', current)
        const searchText = encodeURIComponent(this.state.searchText)
        const pageSize = window.sessionStorage.getItem('neuq_oj.problempagesize')
        if (searchText.length < 1) {
          this.props.getProblemTable(current, pageSize)
        } else {
          this.props.searchProblems(searchText, current, pageSize)
        }
      }
    }
    return (
      <QueueAnim className='problem-table-warp' delay={100}>
        <div className='problem-table-header' key='problem-1'>
          <span className='problem-table-header-title'>问题列表</span>
          <div>
            <Search
              placeholder='题号/标题/作者/标签'
              value={this.state.searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
              onSearch={this.onSearch}
            />
          </div>
        </div>
        <Table
          columns={columns}
          rowKey={record => `problem-${record.id}`}
          dataSource={data}
          // bordered
          // 分页
          pagination={pagination}
          scroll={{x: 768}}
          key='problem-2'
        />
      </QueueAnim>
    )
  }
}

export default ProblemsTable

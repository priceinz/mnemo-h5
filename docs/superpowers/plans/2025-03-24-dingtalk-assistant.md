: true
         },
         "include_extra": false
       }
     }
     ```

### 技术架构

**核心组件:**
1. **数据层** - SQLite数据库，存储员工、签到记录、日报状态
2. **API层** - 钉钉API封装，获取签到数据、发送工作通知
3. **调度层** - APScheduler定时任务，每日数据拉取、异常提醒
4. **业务层** - 员工分组管理、异常检测、消息推送

---

## Chunk 1: 项目初始化和数据库模型

### 任务 1: 项目结构创建

**目标:** 初始化Python项目，配置依赖

**文件:**
- 创建: `requirements.txt`
- 创建: `.env.example`
- 创建: `config.py`
- 创建: `README.md`

**实现:**

- [ ] **步骤 1: 创建 requirements.txt**

```txt
# 钉钉SDK
dingtalk-sdk-python==2.0.0
requests>=2.31.0

# 定时任务
APScheduler==3.10.4

# 数据库
SQLAlchemy==2.0.23
alembic==1.13.1

# 配置管理
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0

# 日志
loguru==0.7.2

# 测试
pytest==7.4.3
pytest-asyncio==0.21.1
```

- [ ] **步骤 2: 创建 .env.example**

```bash
# 钉钉应用配置
DINGTALK_APP_KEY=your_app_key
DINGTALK_APP_SECRET=your_app_secret
DINGTALK_AGENT_ID=your_agent_id

# 数据库
DATABASE_URL=sqlite:///./dingtalk_assistant.db

# 日志级别
LOG_LEVEL=INFO
```

- [ ] **步骤 3: 创建 config.py**

```python
"""配置管理模块."""
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """应用配置类."""

    # 钉钉配置
    dingtalk_app_key: str = Field(..., description="钉钉应用AppKey")
    dingtalk_app_secret: str = Field(..., description="钉钉应用AppSecret")
    dingtalk_agent_id: str = Field(..., description="钉钉应用AgentId")

    # 数据库配置
    database_url: str = Field("sqlite:///./dingtalk_assistant.db", description="数据库URL")

    # 日志配置
    log_level: str = Field("INFO", description="日志级别")

    # 定时任务配置
    check_in_sync_time: str = Field("08:30", description="签到数据同步时间")
    daily_report_sync_time: str = Field("20:00", description="日报数据同步时间")
    absent_reminder_time: str = Field("09:00", description="缺卡提醒时间")
    missing_report_reminder_time: str = Field("21:00", description="未填日报提醒时间")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
```

- [ ] **步骤 4: 提交**

```bash
git add requirements.txt .env.example config.py
git commit -m "chore: 项目初始化，添加依赖和配置"
```

---

### 任务 2: 数据库模型设计

**目标:** 创建员工、签到记录、日报记录的数据库模型

**文件:**
- 创建: `database.py`
- 创建: `models.py`
- 测试: `tests/test_models.py`

**实现:**

- [ ] **步骤 1: 创建 database.py**

```python
"""数据库连接和会话管理."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """获取数据库会话."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """初始化数据库表."""
    Base.metadata.create_all(bind=engine)
```

- [ ] **步骤 2: 创建 models.py**

```python
"""数据库模型定义."""
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean, Enum, Text, Index
from database import Base


class Department(str, PyEnum):
    """部门枚举."""
    ENGINEERING_AUDIT = "engineering_audit"  # 工程审计
    SUPPLY_SUPERVISION = "supply_supervision"  # 供应监察
    INTERNAL_AUDIT = "internal_audit"  # 内部审计


class Employee(Base):
    """员工表."""
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), unique=True, index=True, nullable=False, comment="钉钉用户ID")
    name = Column(String(64), nullable=False, comment="姓名")
    department = Column(Enum(Department), nullable=False, comment="部门")
    mobile = Column(String(20), nullable=True, comment="手机号")
    is_active = Column(Boolean, default=True, comment="是否在职")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_department_active", "department", "is_active"),
    )


class CheckInRecord(Base):
    """签到记录表."""
    __tablename__ = "check_in_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), index=True, nullable=False, comment="钉钉用户ID")
    check_in_date = Column(Date, index=True, nullable=False, comment="签到日期")
    check_in_time = Column(DateTime, nullable=True, comment="签到时间")
    check_out_time = Column(DateTime, nullable=True, comment="签退时间")
    location = Column(String(255), nullable=True, comment="签到地点")
    status = Column(String(32), nullable=False, default="unknown", comment="状态: normal/absent/late/early_leave")
    source = Column(String(32), default="dingtalk", comment="数据来源")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_user_date", "user_id", "check_in_date", unique=True),
    )


class DailyReport(Base):
    """日报记录表."""
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), index=True, nullable=False, comment="钉钉用户ID")
    report_date = Column(Date, index=True, nullable=False, comment="日报日期")
    content = Column(Text, nullable=True, comment="日报内容")
    is_submitted = Column(Boolean, default=False, comment="是否已提交")
    submitted_at = Column(DateTime, nullable=True, comment="提交时间")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_report_user_date", "user_id", "report_date", unique=True),
    )


class NotificationLog(Base):
    """通知记录表."""
    __tablename__ = "notification_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), index=True, nullable=False, comment="接收人用户ID")
    notification_type = Column(String(32), nullable=False, comment="通知类型: absent/missing_report/daily_summary")
    content = Column(Text, nullable=False, comment="通知内容")
    sent_at = Column(DateTime, default=datetime.utcnow, comment="发送时间")
    is_success = Column(Boolean, default=True, comment="是否发送成功")
    error_msg = Column(Text, nullable=True, comment="错误信息")

    __table_args__ = (
        Index("idx_notification_user_type", "user_id", "notification_type"),
    )
```

- [ ] **步骤 3: 创建测试 test_models.py**

```python
"""数据库模型测试."""
import pytest
from datetime import date, datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import Employee, Department, CheckInRecord, DailyReport, NotificationLog


@pytest.fixture
def db_session():
    """创建测试数据库会话."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


def test_create_employee(db_session):
    """测试创建员工."""
    employee = Employee(
        user_id="user123",
        name="张三",
        department=Department.INTERNAL_AUDIT,
        mobile="13800138000"
    )
    db_session.add(employee)
    db_session.commit()

    result = db_session.query(Employee).filter_by(user_id="user123").first()
    assert result is not None
    assert result.name == "张三"
    assert result.department == Department.INTERNAL_AUDIT


def test_create_check_in_record(db_session):
    """测试创建签到记录."""
    record = CheckInRecord(
        user_id="user123",
        check_in_date=date(2024, 1, 15),
        check_in_time=datetime(2024, 1, 15, 8, 30),
        status="normal"
    )
    db_session.add(record)
    db_session.commit()

    result = db_session.query(CheckInRecord).filter_by(user_id="user123").first()
    assert result is not None
    assert result.check_in_date == date(2024, 1, 15)


def test_create_daily_report(db_session):
    """测试创建日报记录."""
    report = DailyReport(
        user_id="user123",
        report_date=date(2024, 1, 15),
        content="今日工作总结...",
        is_submitted=True,
        submitted_at=datetime(2024, 1, 15, 18, 30)
    )
    db_session.add(report)
    db_session.commit()

    result = db_session.query(DailyReport).filter_by(user_id="user123").first()
    assert result is not None
    assert result.is_submitted is True
```

- [ ] **步骤 4: 运行测试**

```bash
pip install -r requirements.txt
pytest tests/test_models.py -v
```

预期输出:
```
tests/test_models.py::test_create_employee PASSED
tests/test_models.py::test_create_check_in_record PASSED
tests/test_models.py::test_create_daily_report PASSED
```

- [ ] **步骤 5: 提交**

```bash
git add database.py models.py tests/test_models.py
git commit -m "feat: 添加数据库模型"
```

---

## Chunk 2: 钉钉API集成层

### 任务 3: 钉钉API客户端封装

**目标:** 封装钉钉API，实现获取access_token、签到数据、发送工作通知

**文件:**
- 创建: `dingtalk_client.py`
- 测试: `tests/test_dingtalk_client.py`

**实现:**

- [ ] **步骤 1: 创建 dingtalk_client.py**

```python
"""钉钉API客户端."""
import time
import requests
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from loguru import logger
from config import settings


class DingTalkClient:
    """钉钉API客户端."""

    BASE_URL = "https://oapi.dingtalk.com"

    def __init__(self):
        self.app_key = settings.dingtalk_app_key
        self.app_secret = settings.dingtalk_app_secret
        self.agent_id = settings.dingtalk_agent_id
        self._access_token: Optional[str] = None
        self._token_expire_time: float = 0

    def _get_access_token(self) -> str:
        """获取访问令牌(带缓存)."""
        current_time = time.time()

        if self._access_token and current_time < self._token_expire_time - 300:
            return self._access_token

        url = f"{self.BASE_URL}/gettoken"
        params = {
            "appkey": self.app_key,
            "appsecret": self.app_secret
        }

        response = requests.get(url, params=params)
        result = response.json()

        if result.get("errcode") != 0:
            logger.error(f"获取access_token失败: {result}")
            raise DingTalkAPIError(f"获取access_token失败: {result.get('errmsg')}")

        self._access_token = result["access_token"]
        self._token_expire_time = current_time + result["expires_in"]

        logger.info("成功获取钉钉access_token")
        return self._access_token

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """发送API请求."""
        url = f"{self.BASE_URL}{endpoint}"

        # 自动添加access_token
        if "params" not in kwargs:
            kwargs["params"] = {}
        kwargs["params"]["access_token"] = self._get_access_token()

        response = requests.request(method, url, **kwargs)
        result = response.json()

        if result.get("errcode") != 0:
            logger.error(f"钉钉API调用失败: {result}")
            raise DingTalkAPIError(f"API错误 {result.get('errcode')}: {result.get('errmsg')}")

        return result

    def get_user_list(self, department_id: str = "1") -> List[Dict[str, Any]]:
        """获取部门用户列表."""
        result = self._request(
            "GET",
            "/topapi/user/list",
            params={"department_id": department_id}
        )
        return result.get("result", {}).get("list", [])

    def get_check_in_data(
        self,
        user_ids: List[str],
        check_date: date,
        offset: int = 0,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """获取签到数据."""
        # 转换为时间戳(毫秒)
        start_time = int(datetime.combine(check_date, datetime.min.time()).timestamp() * 1000)
        end_time = int(datetime.combine(check_date, datetime.max.time()).timestamp() * 1000)

        result = self._request(
            "POST",
            "/topapi/checkin/record/get",
            json={
                "userid_list": ",".join(user_ids),
                "start_time": start_time,
                "end_time": end_time,
                "offset": offset,
                "size": limit
            }
        )

        return result.get("result", {}).get("data", [])

    def get_attendance_list(
        self,
        user_ids: List[str],
        work_date: date
    ) -> List[Dict[str, Any]]:
        """获取考勤数据(打卡结果)."""
        result = self._request(
            "POST",
            "/attendance/list",
            json={
                "userid_list": ",".join(user_ids),
                "work_date_from": work_date.strftime("%Y-%m-%d %H:%M:%S"),
                "work_date_to": work_date.strftime("%Y-%m-%d %H:%M:%S"),
                "offset": 0,
                "limit": 50
            }
        )

        return result.get("recordresult", [])

    def send_work_notification(
        self,
        user_ids: List[str],
        message: Dict[str, Any]
    ) -> bool:
        """发送工作通知."""
        result = self._request(
            "POST",
            "/topapi/message/corpconversation/asyncsend_v2",
            json={
                "agent_id": self.agent_id,
                "userid_list": ",".join(user_ids),
                "msg": message
            }
        )

        logger.info(f"工作通知发送成功: task_id={result.get('task_id')}")
        return True

    def build_text_message(self, content: str) -> Dict[str, Any]:
        """构建文本消息."""
        return {
            "msgtype": "text",
            "text": {"content": content}
        }

    def build_markdown_message(self, title: str, text: str) -> Dict[str, Any]:
        """构建Markdown消息."""
        return {
            "msgtype": "markdown",
            "markdown": {
                "title": title,
                "text": text
            }
        }


class DingTalkAPIError(Exception):
    """钉钉API错误."""
    pass


# 全局客户端实例
dingtalk_client = DingTalkClient()
```

- [ ] **步骤 2: 创建测试 test_dingtalk_client.py**

```python
"""钉钉客户端测试."""
import pytest
from datetime import date
from unittest.mock import Mock, patch, MagicMock
from dingtalk_client import DingTalkClient, DingTalkAPIError


@pytest.fixture
def client():
    """创建测试客户端."""
    with patch.object(DingTalkClient, '_get_access_token', return_value="test_token"):
        client = DingTalkClient()
        return client


@patch('requests.request')
def test_request_success(mock_request, client):
    """测试API请求成功."""
    mock_request.return_value = Mock(
        json=lambda: {"errcode": 0, "result": {"data": []}}
    )

    result = client._request("GET", "/test")

    assert result["errcode"] == 0


@patch('requests.request')
def test_request_error(mock_request, client):
    """测试API请求失败."""
    mock_request.return_value = Mock(
        json=lambda: {"errcode": 40001, "errmsg": "invalid credential"}
    )

    with pytest.raises(DingTalkAPIError):
        client._request("GET", "/test")


@patch('requests.get')
def test_get_access_token(mock_get):
    """测试获取access_token."""
    mock_get.return_value = Mock(
        json=lambda: {
            "errcode": 0,
            "access_token": "test_token_123",
            "expires_in": 7200
        }
    )

    client = DingTalkClient()
    token = client._get_access_token()

    assert token == "test_token_123"


@patch('requests.request')
def test_get_check_in_data(mock_request, client):
    """测试获取签到数据."""
    mock_request.return_value = Mock(
        json=lambda: {
            "errcode": 0,
            "result": {
                "data": [
                    {
                        "userid": "user123",
                        "checkin_time": 1705312800000,
                        "place": "公司总部"
                    }
                ]
            }
        }
    )

    result = client.get_check_in_data(["user123"], date(2024, 1, 15))

    assert len(result) == 1
    assert result[0]["userid"] == "user123"


@patch('requests.request')
def test_send_work_notification(mock_request, client):
    """测试发送工作通知."""
    mock_request.return_value = Mock(
        json=lambda: {"errcode": 0, "task_id": 12345}
    )

    message = client.build_text_message("测试消息")
    result = client.send_work_notification(["user123"], message)

    assert result is True


def test_build_text_message():
    """测试构建文本消息."""
    client = DingTalkClient.__new__(DingTalkClient)
    message = client.build_text_message("Hello World")

    assert message["msgtype"] == "text"
    assert message["text"]["content"] == "Hello World"


def test_build_markdown_message():
    """测试构建Markdown消息."""
    client = DingTalkClient.__new__(DingTalkClient)
    message = client.build_markdown_message("标题", "正文内容")

    assert message["msgtype"] == "markdown"
    assert message["markdown"]["title"] == "标题"
```

- [ ] **步骤 3: 运行测试**

```bash
pytest tests/test_dingtalk_client.py -v
```

预期输出:
```
tests/test_dingtalk_client.py::test_request_success PASSED
tests/test_dingtalk_client.py::test_request_error PASSED
tests/test_dingtalk_client.py::test_get_access_token PASSED
tests/test_dingtalk_client.py::test_get_check_in_data PASSED
tests/test_dingtalk_client.py::test_send_work_notification PASSED
tests/test_dingtalk_client.py::test_build_text_message PASSED
tests/test_dingtalk_client.py::test_build_markdown_message PASSED
```

- [ ] **步骤 4: 提交**

```bash
git add dingtalk_client.py tests/test_dingtalk_client.py
git commit -m "feat: 添加钉钉API客户端封装"
```

---

## Chunk 3: 员工管理服务

### 任务 4: 员工数据管理服务

**目标:** 创建员工管理服务，支持初始化员工数据、按部门查询

**文件:**
- 创建: `employee_service.py`
- 创建: `init_employees.py` (初始化脚本)
- 测试: `tests/test_employee_service.py`

**实现:**

- [ ] **步骤 1: 创建 employee_service.py**

```python
"""员工管理服务."""
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from models import Employee, Department
from database import get_db


class EmployeeService:
    """员工管理服务类."""

    def __init__(self, db: Session):
        self.db = db

    def create_employee(
        self,
        user_id: str,
        name: str,
        department: Department,
        mobile: Optional[str] = None
    ) -> Employee:
        """创建员工."""
        employee = Employee(
            user_id=user_id,
            name=name,
            department=department,
            mobile=mobile
        )
        self.db.add(employee)
        self.db.commit()
        self.db.refresh(employee)
        return employee

    def get_employee_by_user_id(self, user_id: str) -> Optional[Employee]:
        """根据用户ID获取员工."""
        return self.db.query(Employee).filter(
            Employee.user_id == user_id,
            Employee.is_active == True
        ).first()

    def get_all_employees(self, active_only: bool = True) -> List[Employee]:
        """获取所有员工."""
        query = self.db.query(Employee)
        if active_only:
            query = query.filter(Employee.is_active == True)
        return query.all()

    def get_employees_by_department(
        self,
        department: Department,
        active_only: bool = True
    ) -> List[Employee]:
        """根据部门获取员工."""
        query = self.db.query(Employee).filter(Employee.department == department)
        if active_only:
            query = query.filter(Employee.is_active == True)
        return query.all()

    def get_employee_user_ids(self, active_only: bool = True) -> List[str]:
        """获取所有员工用户ID列表."""
        employees = self.get_all_employees(active_only)
        return [e.user_id for e in employees]

    def update_employee(
        self,
        user_id: str,
        **kwargs
    ) -> Optional[Employee]:
        """更新员工信息."""
        employee = self.get_employee_by_user_id(user_id)
        if not employee:
            return None

        for key, value in kwargs.items():
            if hasattr(employee, key):
                setattr(employee, key, value)

        self.db.commit()
        self.db.refresh(employee)
        return employee

    def deactivate_employee(self, user_id: str) -> bool:
        """停用员工."""
        employee = self.update_employee(user_id, is_active=False)
        return employee is not None

    def get_department_summary(self) -> Dict[str, int]:
        """获取各部门人员统计."""
        summary = {}
        for dept in Department:
            count = self.db.query(Employee).filter(
                Employee.department == dept,
                Employee.is_active == True
            ).count()
            summary[dept.value] = count
        return summary


# 7名员工配置
DEFAULT_EMPLOYEES = [
    # 工程审计 - 1人
    {"user_id": "eng_audit_01", "name": "工程审计员", "department": Department.ENGINEERING_AUDIT},

    # 供应监察 - 2人
    {"user_id": "sup_audit_01", "name": "供应监察员1", "department": Department.SUPPLY_SUPERVISION},
    {"user_id": "sup_audit_02", "name": "供应监察员2", "department": Department.SUPPLY_SUPERVISION},

    # 内部审计 - 4人
    {"user_id": "int_audit_01", "name": "内部审计员1", "department": Department.INTERNAL_AUDIT},
    {"user_id": "int_audit_02", "name": "内部审计员2", "department": Department.INTERNAL_AUDIT},
    {"user_id": "int_audit_03", "name": "内部审计员3", "department": Department.INTERNAL_AUDIT},
    {"user_id": "int_audit_04", "name": "内部审计员4", "department": Department.INTERNAL_AUDIT},
]


def init_default_employees(db: Session) -> None:
    """初始化默认员工数据."""
    service = EmployeeService(db)

    for emp_data in DEFAULT_EMPLOYEES:
        existing = service.get_employee_by_user_id(emp_data["user_id"])
        if not existing:
            service.create_employee(**emp_data)
            print(f"✓ 创建员工: {emp_data['name']} ({emp_data['department'].value})")
        else:
            print(f"✗ 员工已存在: {emp_data['name']}")
```

- [ ] **步骤 2: 创建 init_employees.py**

```python
#!/usr/bin/env python3
"""初始化员工数据脚本."""
from database import SessionLocal, init_db
from employee_service import init_default_employees


def main():
    """主函数."""
    # 初始化数据库表
    init_db()
    print("✓ 数据库表初始化完成")

    # 创建会话
    db = SessionLocal()
    try:
        # 初始化员工数据
        init_default_employees(db)
        print("\n✓ 员工数据初始化完成")

        # 显示统计
        from employee_service import EmployeeService
        service = EmployeeService(db)
        summary = service.get_department_summary()

        print("\n=== 部门人员统计 ===")
        for dept, count in summary.items():
            print(f"  {dept}: {count}人")

        print(f"\n总计: {sum(summary.values())}人")

    finally:
        db.close()


if __name__ == "__main__":
    main()
```

- [ ] **步骤 3: 创建测试 test_employee_service.py**

```python
"""员工服务测试."""
import pytest
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import Employee, Department
from employee_service import EmployeeService, init_default_employees


@pytest.fixture
def db_session():
    """创建测试数据库会话."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


class TestEmployeeService:
    """员工服务测试类."""

    def test_create_employee(self, db_session):
        """测试创建员工."""
        service = EmployeeService(db_session)
        employee = service.create_employee(
            user_id="test_user",
            name="测试员工",
            department=Department.INTERNAL_AUDIT,
            mobile="13800138000"
        )

        assert employee.user_id == "test_user"
        assert employee.name == "测试员工"
        assert employee.department == Department.INTERNAL_AUDIT

    def test_get_employee_by_user_id(self, db_session):
        """测试根据ID获取员工."""
        service = EmployeeService(db_session)
        service.create_employee(
            user_id="test_user",
            name="测试员工",
            department=Department.INTERNAL_AUDIT
        )

        employee = service.get_employee_by_user_id("test_user")
        assert employee is not None
        assert employee.name == "测试员工"

    def test_get_all_employees(self, db_session):
        """测试获取所有员工."""
        service = EmployeeService(db_session)
        service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)
        service.create_employee("user2", "员工2", Department.SUPPLY_SUPERVISION)

        employees = service.get_all_employees()
        assert len(employees) == 2

    def test_get_employees_by_department(self, db_session):
        """测试按部门获取员工."""
        service = EmployeeService(db_session)
        service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)
        service.create_employee("user2", "员工2", Department.INTERNAL_AUDIT)
        service.create_employee("user3", "员工3", Department.SUPPLY_SUPERVISION)

        employees = service.get_employees_by_department(Department.INTERNAL_AUDIT)
        assert len(employees) == 2

    def test_deactivate_employee(self, db_session):
        """测试停用员工."""
        service = EmployeeService(db_session)
        service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)

        result = service.deactivate_employee("user1")
        assert result is True

        employees = service.get_all_employees(active_only=True)
        assert len(employees) == 0

    def test_get_department_summary(self, db_session):
        """测试部门统计."""
        service = EmployeeService(db_session)
        service.create_employee("user1", "员工1", Department.ENGINEERING_AUDIT)
        service.create_employee("user2", "员工2", Department.SUPPLY_SUPERVISION)
        service.create_employee("user3", "员工3", Department.SUPPLY_SUPERVISION)

        summary = service.get_department_summary()
        assert summary[Department.ENGINEERING_AUDIT.value] == 1
        assert summary[Department.SUPPLY_SUPERVISION.value] == 2

    def test_init_default_employees(self, db_session):
        """测试初始化默认员工."""
        init_default_employees(db_session)

        service = EmployeeService(db_session)
        employees = service.get_all_employees()

        # 验证总数为7人
        assert len(employees) == 7

        # 验证各部门人数
        summary = service.get_department_summary()
        assert summary[Department.ENGINEERING_AUDIT.value] == 1
        assert summary[Department.SUPPLY_SUPERVISION.value] == 2
        assert summary[Department.INTERNAL_AUDIT.value] == 4
```

- [ ] **步骤 4: 运行测试**

```bash
pytest tests/test_employee_service.py -v
```

预期输出:
```
tests/test_employee_service.py::TestEmployeeService::test_create_employee PASSED
tests/test_employee_service.py::TestEmployeeService::test_get_employee_by_user_id PASSED
tests/test_employee_service.py::TestEmployeeService::test_get_all_employees PASSED
tests/test_employee_service.py::TestEmployeeService::test_get_employees_by_department PASSED
tests/test_employee_service.py::TestEmployeeService::test_deactivate_employee PASSED
tests/test_employee_service.py::TestEmployeeService::test_get_department_summary PASSED
tests/test_employee_service.py::TestEmployeeService::test_init_default_employees PASSED
```

- [ ] **步骤 5: 提交**

```bash
git add employee_service.py init_employees.py tests/test_employee_service.py
git commit -m "feat: 添加员工管理服务"
```

---

## Chunk 4: 签到和日报数据同步服务

### 任务 5: 签到数据同步服务

**目标:** 创建签到数据同步服务，从钉钉获取签到数据并存储到本地数据库

**文件:**
- 创建: `checkin_service.py`
- 测试: `tests/test_checkin_service.py`

**实现:**

- [ ] **步骤 1: 创建 checkin_service.py**

```python
"""签到数据同步服务."""
from datetime import date, datetime
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from loguru import logger

from models import CheckInRecord, Employee
from dingtalk_client import dingtalk_client, DingTalkClient
from employee_service import EmployeeService


class CheckInService:
    """签到数据同步服务."""

    def __init__(self, db: Session, client: DingTalkClient = None):
        self.db = db
        self.client = client or dingtalk_client
        self.employee_service = EmployeeService(db)

    def sync_check_in_data(self, target_date: Optional[date] = None) -> Dict[str, int]:
        """
        同步签到数据.

        Args:
            target_date: 目标日期，默认为昨天

        Returns:
            统计信息: {"total": 总数, "new": 新增数, "updated": 更新数}
        """
        if target_date is None:
            target_date = date.today()

        logger.info(f"开始同步 {target_date} 的签到数据")

        # 获取所有员工
        employees = self.employee_service.get_all_employees()
        user_ids = [e.user_id for e in employees]

        if not user_ids:
            logger.warning("没有员工数据，跳过同步")
            return {"total": 0, "new": 0, "updated": 0}

        # 从钉钉获取签到数据
        try:
            records = self.client.get_check_in_data(user_ids, target_date)
            logger.info(f"从钉钉获取到 {len(records)} 条签到记录")
        except Exception as e:
            logger.error(f"获取签到数据失败: {e}")
            return {"total": 0, "new": 0, "updated": 0}

        # 处理签到数据
        stats = {"total": 0, "new": 0, "updated": 0}

        # 按用户ID分组记录
        user_records: Dict[str, List[dict]] = {}
        for record in records:
            user_id = record.get("userid")
            if user_id not in user_records:
                user_records[user_id] = []
            user_records[user_id].append(record)

        # 更新或创建签到记录
        for user_id in user_ids:
            user_checkins = user_records.get(user_id, [])
            result = self._update_user_check_in(user_id, target_date, user_checkins)

            if result == "new":
                stats["new"] += 1
            elif result == "updated":
                stats["updated"] += 1

            stats["total"] += 1

        self.db.commit()
        logger.info(f"签到数据同步完成: {stats}")
        return stats

    def _update_user_check_in(
        self,
        user_id: str,
        check_date: date,
        checkins: List[dict]
    ) -> str:
        """
        更新用户签到记录.

        Returns:
            "new" | "updated" | "unchanged"
        """
        # 查询现有记录
        existing = self.db.query(CheckInRecord).filter(
            CheckInRecord.user_id == user_id,
            CheckInRecord.check_in_date == check_date
        ).first()

        # 解析签到数据
        check_in_time = None
        check_out_time = None
        location = None
        status = "absent"  # 默认为缺卡

        if checkins:
            # 按时间排序
            sorted_checkins = sorted(checkins, key=lambda x: x.get("checkin_time", 0))

            # 第一次签到为上班时间
            if sorted_checkins:
                first = sorted_checkins[0]
                check_in_time = self._timestamp_to_datetime(first.get("checkin_time"))
                location = first.get("place", "")

            # 最后一次签退为下班时间(如果有多条记录)
            if len(sorted_checkins) > 1:
                last = sorted_checkins[-1]
                check_out_time = self._timestamp_to_datetime(last.get("checkin_time"))

            status = "normal"

        # 创建或更新记录
        if existing:
            existing.check_in_time = check_in_time
            existing.check_out_time = check_out_time
            existing.location = location
            existing.status = status
            existing.updated_at = datetime.utcnow()
            return "updated" if checkins else "unchanged"
        else:
            record = CheckInRecord(
                user_id=user_id,
                check_in_date=check_date,
                check_in_time=check_in_time,
                check_out_time=check_out_time,
                location=location,
                status=status
            )
            self.db.add(record)
            return "new"

    def _timestamp_to_datetime(self, timestamp_ms: Optional[int]) -> Optional[datetime]:
        """将毫秒时间戳转换为datetime."""
        if not timestamp_ms:
            return None
        return datetime.fromtimestamp(timestamp_ms / 1000)

    def get_check_in_summary(self, target_date: Optional[date] = None) -> Dict:
        """获取签到统计摘要."""
        if target_date is None:
            target_date = date.today()

        records = self.db.query(CheckInRecord).filter(
            CheckInRecord.check_in_date == target_date
        ).all()

        total = len(records)
        normal = sum(1 for r in records if r.status == "normal")
        absent = sum(1 for r in records if r.status == "absent")

        # 获取未打卡员工
        all_employees = self.employee_service.get_all_employees()
        checked_user_ids = {r.user_id for r in records if r.status == "normal"}
        absent_employees = [
            e for e in all_employees
            if e.user_id not in checked_user_ids
        ]

        return {
            "date": target_date.isoformat(),
            "total_employees": len(all_employees),
            "checked_in": normal,
            "absent": absent,
            "absent_employees": [
                {"user_id": e.user_id, "name": e.name, "department": e.department.value}
                for e in absent_employees
            ]
        }

    def get_user_check_in(self, user_id: str, target_date: Optional[date] = None) -> Optional[CheckInRecord]:
        """获取用户指定日期的签到记录."""
        if target_date is None:
            target_date = date.today()

        return self.db.query(CheckInRecord).filter(
            CheckInRecord.user_id == user_id,
            CheckInRecord.check_in_date == target_date
        ).first()
```

- [ ] **步骤 2: 创建测试 test_checkin_service.py**

```python
"""签到服务测试."""
import pytest
from datetime import date, datetime
from unittest.mock import Mock, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import CheckInRecord, Employee, Department
from checkin_service import CheckInService


@pytest.fixture
def db_session():
    """创建测试数据库会话."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


@pytest.fixture
def mock_client():
    """创建模拟钉钉客户端."""
    client = Mock()
    return client


class TestCheckInService:
    """签到服务测试类."""

    def test_sync_check_in_data_empty_employees(self, db_session, mock_client):
        """测试无员工时的同步."""
        service = CheckInService(db_session, mock_client)
        result = service.sync_check_in_data(date(2024, 1, 15))

        assert result["total"] == 0

    def test_sync_check_in_data_with_records(self, db_session, mock_client):
        """测试有签到数据的同步."""
        # 创建测试员工
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)

        # 模拟钉钉返回数据
        mock_client.get_check_in_data.return_value = [
            {
                "userid": "user1",
                "checkin_time": 1705312800000,  # 2024-01-15 10:00:00
                "place": "公司总部"
            }
        ]

        service = CheckInService(db_session, mock_client)
        result = service.sync_check_in_data(date(2024, 1, 15))

        assert result["new"] == 1

        # 验证数据库记录
        record = db_session.query(CheckInRecord).filter_by(user_id="user1").first()
        assert record is not None
        assert record.status == "normal"

    def test_get_check_in_summary(self, db_session, mock_client):
        """测试获取签到摘要."""
        # 创建员工
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)
        emp_service.create_employee("user2", "员工2", Department.INTERNAL_AUDIT)

        # 创建签到记录
        db_session.add(CheckInRecord(
            user_id="user1",
            check_in_date=date(2024, 1, 15),
            check_in_time=datetime(2024, 1, 15, 9, 0),
            status="normal"
        ))
        db_session.add(CheckInRecord(
            user_id="user2",
            check_in_date=date(2024, 1, 15),
            status="absent"
        ))
        db_session.commit()

        service = CheckInService(db_session, mock_client)
        summary = service.get_check_in_summary(date(2024, 1, 15))

        assert summary["total_employees"] == 2
        assert summary["checked_in"] == 1
        assert summary["absent"] == 1
```

- [ ] **步骤 3: 运行测试**

```bash
pytest tests/test_checkin_service.py -v
```

- [ ] **步骤 4: 提交**

```bash
git add checkin_service.py tests/test_checkin_service.py
git commit -m "feat: 添加签到数据同步服务"
```

---

### 任务 6: 日报数据同步服务

**目标:** 创建日报数据同步服务，模拟/同步日报数据

**文件:**
- 创建: `daily_report_service.py`
- 测试: `tests/test_daily_report_service.py`

**实现:**

- [ ] **步骤 1: 创建 daily_report_service.py**

```python
"""日报管理服务."""
from datetime import date, datetime, time
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from loguru import logger

from models import DailyReport, Employee, Department
from employee_service import EmployeeService


class DailyReportService:
    """日报管理服务."""

    # 日报截止时间(21:00)
    REPORT_DEADLINE = time(21, 0)

    def __init__(self, db: Session):
        self.db = db
        self.employee_service = EmployeeService(db)

    def get_or_create_report(
        self,
        user_id: str,
        report_date: Optional[date] = None
    ) -> DailyReport:
        """获取或创建日报记录."""
        if report_date is None:
            report_date = date.today()

        report = self.db.query(DailyReport).filter(
            DailyReport.user_id == user_id,
            DailyReport.report_date == report_date
        ).first()

        if not report:
            report = DailyReport(
                user_id=user_id,
                report_date=report_date,
                is_submitted=False
            )
            self.db.add(report)
            self.db.commit()

        return report

    def submit_report(
        self,
        user_id: str,
        content: str,
        report_date: Optional[date] = None
    ) -> DailyReport:
        """提交日报."""
        if report_date is None:
            report_date = date.today()

        report = self.get_or_create_report(user_id, report_date)
        report.content = content
        report.is_submitted = True
        report.submitted_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(report)

        logger.info(f"用户 {user_id} 提交日报: {report_date}")
        return report

    def get_report(
        self,
        user_id: str,
        report_date: Optional[date] = None
    ) -> Optional[DailyReport]:
        """获取日报."""
        if report_date is None:
            report_date = date.today()

        return self.db.query(DailyReport).filter(
            DailyReport.user_id == user_id,
            DailyReport.report_date == report_date
        ).first()

    def get_missing_report_employees(
        self,
        target_date: Optional[date] = None
    ) -> List[Employee]:
        """获取未提交日报的员工列表."""
        if target_date is None:
            target_date = date.today()

        # 获取所有员工
        all_employees = self.employee_service.get_all_employees()

        # 获取已提交日报的员工ID
        submitted_user_ids = {
            r.user_id for r in self.db.query(DailyReport).filter(
                DailyReport.report_date == target_date,
                DailyReport.is_submitted == True
            ).all()
        }

        # 返回未提交的员工
        return [
            e for e in all_employees
            if e.user_id not in submitted_user_ids
        ]

    def get_daily_report_summary(self, target_date: Optional[date] = None) -> Dict:
        """获取日报统计摘要."""
        if target_date is None:
            target_date = date.today()

        all_employees = self.employee_service.get_all_employees()

        # 获取日报记录
        reports = self.db.query(DailyReport).filter(
            DailyReport.report_date == target_date
        ).all()

        submitted = sum(1 for r in reports if r.is_submitted)
        total = len(all_employees)

        # 获取未提交列表
        submitted_ids = {r.user_id for r in reports if r.is_submitted}
        missing_employees = [
            e for e in all_employees
            if e.user_id not in submitted_ids
        ]

        return {
            "date": target_date.isoformat(),
            "total_employees": total,
            "submitted": submitted,
            "missing": total - submitted,
            "submission_rate": round(submitted / total * 100, 1) if total > 0 else 0,
            "missing_employees": [
                {"user_id": e.user_id, "name": e.name, "department": e.department.value}
                for e in missing_employees
            ]
        }

    def sync_reports_from_dingtalk(self, target_date: Optional[date] = None) -> Dict[str, int]:
        """
        从钉钉同步日报数据.

        注意: 钉钉审批/日志API可能需要根据实际开通的审批流调用
        这里提供框架，具体API调用需根据实际配置实现
        """
        if target_date is None:
            target_date = date.today()

        logger.info(f"开始同步 {target_date} 的日报数据")

        # TODO: 实现钉钉日报数据拉取
        # 钉钉日志API: /topapi/report/list
        # 或者通过审批表单获取

        # 目前返回空统计
        return {"synced": 0, "new": 0, "updated": 0}

    def is_after_deadline(self) -> bool:
        """检查是否已过日报截止时间(21:00)."""
        now = datetime.now()
        deadline = datetime.combine(now.date(), self.REPORT_DEADLINE)
        return now >= deadline
```

- [ ] **步骤 2: 创建测试 test_daily_report_service.py**

```python
"""日报服务测试."""
import pytest
from datetime import date, datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import DailyReport, Employee, Department
from daily_report_service import DailyReportService


@pytest.fixture
def db_session():
    """创建测试数据库会话."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


class TestDailyReportService:
    """日报服务测试类."""

    def test_get_or_create_report(self, db_session):
        """测试获取或创建日报."""
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)

        service = DailyReportService(db_session)
        report = service.get_or_create_report("user1", date(2024, 1, 15))

        assert report is not None
        assert report.user_id == "user1"
        assert report.is_submitted is False

    def test_submit_report(self, db_session):
        """测试提交日报."""
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)

        service = DailyReportService(db_session)
        report = service.submit_report(
            "user1",
            "今日完成工作...",
            date(2024, 1, 15)
        )

        assert report.is_submitted is True
        assert report.content == "今日完成工作..."
        assert report.submitted_at is not None

    def test_get_missing_report_employees(self, db_session):
        """测试获取未提交日报的员工."""
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)
        emp_service.create_employee("user2", "员工2", Department.INTERNAL_AUDIT)

        service = DailyReportService(db_session)

        # 用户1提交日报
        service.submit_report("user1", "工作内容", date(2024, 1, 15))

        # 获取未提交列表
        missing = service.get_missing_report_employees(date(2024, 1, 15))

        assert len(missing) == 1
        assert missing[0].user_id == "user2"

    def test_get_daily_report_summary(self, db_session):
        """测试获取日报摘要."""
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "员工1", Department.INTERNAL_AUDIT)
        emp_service.create_employee("user2", "员工2", Department.INTERNAL_AUDIT)
        emp_service.create_employee("user3", "员工3", Department.INTERNAL_AUDIT)

        service = DailyReportService(db_session)
        service.submit_report("user1", "工作内容", date(2024, 1, 15))
        service.submit_report("user2", "工作内容", date(2024, 1, 15))

        summary = service.get_daily_report_summary(date(2024, 1, 15))

        assert summary["total_employees"] == 3
        assert summary["submitted"] == 2
        assert summary["missing"] == 1
        assert summary["submission_rate"] == 66.7
        assert len(summary["missing_employees"]) == 1
```

- [ ] **步骤 3: 运行测试**

```bash
pytest tests/test_daily_report_service.py -v
```

- [ ] **步骤 4: 提交**

```bash
git add daily_report_service.py tests/test_daily_report_service.py
git commit -m "feat: 添加日报管理服务"
```

---

## Chunk 5: 消息通知服务

### 任务 7: 钉钉消息推送服务

**目标:** 创建消息推送服务，实现异常提醒和每日汇总推送

**文件:**
- 创建: `notification_service.py`
- 创建: `message_templates.py`
- 测试: `tests/test_notification_service.py`

**实现:**

- [ ] **步骤 1: 创建 message_templates.py**

```python
"""消息模板定义."""
from datetime import date
from typing import List, Dict


def build_absent_reminder(employee_name: str, check_date: date) -> str:
    """构建缺卡提醒消息."""
    return f"""## ⏰ 打卡提醒

**{employee_name}**，您好！

检测到您 **{check_date.month}月{check_date.day}日** 尚未打卡，请及时补卡。

如有特殊情况，请提前告知。

---
_本消息由系统自动发送_"""


def build_missing_report_reminder(employee_name: str, report_date: date) -> str:
    """构建日报未提交提醒消息."""
    return f"""## 📝 日报提醒

**{employee_name}**，您好！

检测到您 **{report_date.month}月{report_date.day}日** 的日报尚未提交。

请在今日24:00前完成提交。

---
_本消息由系统自动发送_"""


def build_daily_checkin_summary(
    summary_date: date,
    total: int,
    checked_in: int,
    absent: int,
    absent_list: List[Dict]
) -> str:
    """构建每日签到汇总消息."""
    absent_text = ""
    if absent_list:
        absent_text = "\n".join([
            f"- **{e['name']}** ({_get_dept_name(e['department'])})"
            for e in absent_list
        ])
    else:
        absent_text = "✅ 无"

    return f"""## 📊 每日签到汇总 ({summary_date.month}月{summary_date.day}日)

| 指标 | 数据 |
|------|------|
| 总人数 | {total}人 |
| 已打卡 | ✅ {checked_in}人 |
| 未打卡 | ⚠️ {absent}人 |

### 未打卡人员

{absent_text}

---
_统计时间: {summary_date}_"""


def build_daily_report_summary(
    summary_date: date,
    total: int,
    submitted: int,
    missing: int,
    missing_list: List[Dict]
) -> str:
    """构建每日日报汇总消息."""
    missing_text = ""
    if missing_list:
        missing_text = "\n".join([
            f"- **{e['name']}** ({_get_dept_name(e['department'])})"
            for e in missing_list
        ])
    else:
        missing_text = "✅ 全部已提交"

    rate = round(submitted / total * 100, 1) if total > 0 else 0

    return f"""## 📋 每日日报汇总 ({summary_date.month}月{summary_date.day}日)

| 指标 | 数据 |
|------|------|
| 总人数 | {total}人 |
| 已提交 | ✅ {submitted}人 |
| 未提交 | ⚠️ {missing}人 |
| 提交率 | {rate}% |

### 未提交人员

{missing_text}

---
_统计时间: {summary_date}_"""


def build_weekly_summary(
    week_start: date,
    week_end: date,
    checkin_stats: Dict,
    report_stats: Dict
) -> str:
    """构建周汇总消息."""
    return f"""## 📈 周报汇总 ({week_start.month}月{week_start.day}日 - {week_end.month}月{week_end.day}日)

### 签到统计
- 平均出勤率: {checkin_stats.get('avg_rate', 0)}%
- 异常打卡次数: {checkin_stats.get('abnormal_count', 0)}次

### 日报统计
- 平均提交率: {report_stats.get('avg_rate', 0)}%
- 未按时提交: {report_stats.get('late_count', 0)}次

---
_数据仅供参考，以钉钉系统为准_"""


def _get_dept_name(dept_code: str) -> str:
    """获取部门中文名."""
    dept_names = {
        "engineering_audit": "工程审计",
        "supply_supervision": "供应监察",
        "internal_audit": "内部审计"
    }
    return dept_names.get(dept_code, dept_code)
```

- [ ] **步骤 2: 创建 notification_service.py**

```python
"""消息通知服务."""
from datetime import date, datetime
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from loguru import logger

from models import NotificationLog, Employee
from dingtalk_client import dingtalk_client, DingTalkClient
from employee_service import EmployeeService
from message_templates import (
    build_absent_reminder,
    build_missing_report_reminder,
    build_daily_checkin_summary,
    build_daily_report_summary
)


class NotificationService:
    """消息通知服务."""

    def __init__(self, db: Session, client: DingTalkClient = None):
        self.db = db
        self.client = client or dingtalk_client
        self.employee_service = EmployeeService(db)

    def send_absent_reminder(
        self,
        user_id: str,
        check_date: Optional[date] = None
    ) -> bool:
        """发送缺卡提醒."""
        if check_date is None:
            check_date = date.today()

        # 获取员工信息
        employee = self.employee_service.get_employee_by_user_id(user_id)
        if not employee:
            logger.warning(f"员工不存在: {user_id}")
            return False

        # 构建消息
        content = build_absent_reminder(employee.name, check_date)
        message = self.client.build_markdown_message("打卡提醒", content)

        # 发送消息
        try:
            self.client.send_work_notification([user_id], message)
            self._log_notification(user_id, "absent", content, True)
            logger.info(f"已发送缺卡提醒给: {employee.name}")
            return True
        except Exception as e:
            self._log_notification(user_id, "absent", content, False, str(e))
            logger.error(f"发送缺卡提醒失败: {e}")
            return False

    def send_missing_report_reminder(
        self,
        user_id: str,
        report_date: Optional[date] = None
    ) -> bool:
        """发送日报未提交提醒."""
        if report_date is None:
            report_date = date.today()

        employee = self.employee_service.get_employee_by_user_id(user_id)
        if not employee:
            logger.warning(f"员工不存在: {user_id}")
            return False

        content = build_missing_report_reminder(employee.name, report_date)
        message = self.client.build_markdown_message("日报提醒", content)

        try:
            self.client.send_work_notification([user_id], message)
            self._log_notification(user_id, "missing_report", content, True)
            logger.info(f"已发送日报提醒给: {employee.name}")
            return True
        except Exception as e:
            self._log_notification(user_id, "missing_report", content, False, str(e))
            logger.error(f"发送日报提醒失败: {e}")
            return False

    def send_daily_checkin_summary(
        self,
        manager_user_id: str,
        summary_data: Dict
    ) -> bool:
        """发送每日签到汇总给管理者."""
        content = build_daily_checkin_summary(
            summary_date=date.fromisoformat(summary_data["date"]),
            total=summary_data["total_employees"],
            checked_in=summary_data["checked_in"],
            absent=summary_data["absent"],
            absent_list=summary_data["absent_employees"]
        )

        message = self.client.build_markdown_message("每日签到汇总", content)

        try:
            self.client.send_work_notification([manager_user_id], message)
            self._log_notification(manager_user_id, "daily_checkin_summary", content, True)
            logger.info(f"已发送签到汇总给管理者")
            return True
        except Exception as e:
            self._log_notification(manager_user_id, "daily_checkin_summary", content, False, str(e))
            logger.error(f"发送签到汇总失败: {e}")
            return False

    def send_daily_report_summary(
        self,
        manager_user_id: str,
        summary_data: Dict
    ) -> bool:
        """发送每日日报汇总给管理者."""
        content = build_daily_report_summary(
            summary_date=date.fromisoformat(summary_data["date"]),
            total=summary_data["total_employees"],
            submitted=summary_data["submitted"],
            missing=summary_data["missing"],
            missing_list=summary_data["missing_employees"]
        )

        message = self.client.build_markdown_message("每日日报汇总", content)

        try:
            self.client.send_work_notification([manager_user_id], message)
            self._log_notification(manager_user_id, "daily_report_summary", content, True)
            logger.info(f"已发送日报汇总给管理者")
            return True
        except Exception as e:
            self._log_notification(manager_user_id, "daily_report_summary", content, False, str(e))
            logger.error(f"发送日报汇总失败: {e}")
            return False

    def send_batch_absent_reminders(
        self,
        employee_list: List[Dict],
        check_date: Optional[date] = None
    ) -> Dict[str, int]:
        """批量发送缺卡提醒."""
        if check_date is None:
            check_date = date.today()

        stats = {"success": 0, "failed": 0}

        for emp in employee_list:
            if self.send_absent_reminder(emp["user_id"], check_date):
                stats["success"] += 1
            else:
                stats["failed"] += 1

        logger.info(f"批量缺卡提醒完成: {stats}")
        return stats

    def send_batch_missing_report_reminders(
        self,
        employee_list: List[Dict],
        report_date: Optional[date] = None
    ) -> Dict[str, int]:
        """批量发送日报提醒."""
        if report_date is None:
            report_date = date.today()

        stats = {"success": 0, "failed": 0}

        for emp in employee_list:
            if self.send_missing_report_reminder(emp["user_id"], report_date):
                stats["success"] += 1
            else:
                stats["failed"] += 1

        logger.info(f"批量日报提醒完成: {stats}")
        return stats

    def _log_notification(
        self,
        user_id: str,
        notification_type: str,
        content: str,
        is_success: bool,
        error_msg: Optional[str] = None
    ) -> None:
        """记录通知日志."""
        log = NotificationLog(
            user_id=user_id,
            notification_type=notification_type,
            content=content[:500],  # 限制长度
            is_success=is_success,
            error_msg=error_msg
        )
        self.db.add(log)
        self.db.commit()

    def get_recent_notifications(
        self,
        user_id: Optional[str] = None,
        notification_type: Optional[str] = None,
        limit: int = 50
    ) -> List[NotificationLog]:
        """获取最近的通知记录."""
        query = self.db.query(NotificationLog)

        if user_id:
            query = query.filter(NotificationLog.user_id == user_id)
        if notification_type:
            query = query.filter(NotificationLog.notification_type == notification_type)

        return query.order_by(NotificationLog.sent_at.desc()).limit(limit).all()
```

- [ ] **步骤 3: 创建测试 test_notification_service.py**

```python
"""通知服务测试."""
import pytest
from datetime import date
from unittest.mock import Mock, patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import Employee, Department, NotificationLog
from notification_service import NotificationService


@pytest.fixture
def db_session():
    """创建测试数据库会话."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


@pytest.fixture
def mock_client():
    """创建模拟钉钉客户端."""
    client = Mock()
    client.build_markdown_message.return_value = {"msgtype": "markdown", "markdown": {}}
    client.send_work_notification.return_value = True
    return client


class TestNotificationService:
    """通知服务测试类."""

    def test_send_absent_reminder(self, db_session, mock_client):
        """测试发送缺卡提醒."""
        # 创建员工
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "张三", Department.INTERNAL_AUDIT)

        service = NotificationService(db_session, mock_client)
        result = service.send_absent_reminder("user1", date(2024, 1, 15))

        assert result is True
        mock_client.send_work_notification.assert_called_once()

        # 验证日志记录
        logs = db_session.query(NotificationLog).all()
        assert len(logs) == 1
        assert logs[0].notification_type == "absent"

    def test_send_missing_report_reminder(self, db_session, mock_client):
        """测试发送日报提醒."""
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "张三", Department.INTERNAL_AUDIT)

        service = NotificationService(db_session, mock_client)
        result = service.send_missing_report_reminder("user1", date(2024, 1, 15))

        assert result is True

        logs = db_session.query(NotificationLog).filter_by(notification_type="missing_report").all()
        assert len(logs) == 1

    def test_send_daily_checkin_summary(self, db_session, mock_client):
        """测试发送签到汇总."""
        service = NotificationService(db_session, mock_client)

        summary_data = {
            "date": "2024-01-15",
            "total_employees": 7,
            "checked_in": 6,
            "absent": 1,
            "absent_employees": [
                {"user_id": "user1", "name": "张三", "department": "internal_audit"}
            ]
        }

        result = service.send_daily_checkin_summary("manager1", summary_data)

        assert result is True
        mock_client.send_work_notification.assert_called_once()

    def test_send_batch_reminders(self, db_session, mock_client):
        """测试批量发送提醒."""
        from employee_service import EmployeeService
        emp_service = EmployeeService(db_session)
        emp_service.create_employee("user1", "张三", Department.INTERNAL_AUDIT)
        emp_service.create_employee("user2", "李四", Department.INTERNAL_AUDIT)

        service = NotificationService(db_session, mock_client)

        employee_list = [
            {"user_id": "user1", "name": "张三"},
            {"user_id": "user2", "name": "李四"}
        ]

        stats = service.send_batch_absent_reminders(employee_list, date(2024, 1, 15))

        assert stats["success"] == 2
        assert stats["failed"] == 0
```

- [ ] **步骤 4: 运行测试**

```bash
pytest tests/test_notification_service.py -v
```

- [ ] **步骤 5: 提交**

```bash
git add notification_service.py message_templates.py tests/test_notification_service.py
git commit -m "feat: 添加消息通知服务"
```

---

## Chunk 6: 定时任务调度器

### 任务 8: APScheduler定时任务配置

**目标:** 配置定时任务调度器，实现自动数据同步和提醒

**文件:**
- 创建: `scheduler.py`
- 创建: `tasks.py`
- 测试: `tests/test_scheduler.py`

**实现:**

- [ ] **步骤 1: 创建 tasks.py**
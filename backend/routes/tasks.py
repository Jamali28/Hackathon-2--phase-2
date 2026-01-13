from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, desc, asc
from datetime import datetime, timezone

from db import get_session
from models import Task, TaskCreate, TaskUpdate, TaskRead
from dependencies import get_current_user

router = APIRouter(prefix="/tasks")

@router.get("/", response_model=List[TaskRead])
async def list_tasks(
    status: Optional[str] = Query("all", enum=["all", "pending", "completed"]),
    sort: Optional[str] = Query("created", enum=["created", "title"]),
    request: Request = Depends(),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """List all tasks for the authenticated user with filtering and sorting."""
    query = select(Task).where(Task.user_id == current_user_id)

    # Filter by status
    if status == "pending":
        query = query.where(Task.completed == False)
    elif status == "completed":
        query = query.where(Task.completed == True)

    # Sort
    if sort == "title":
        query = query.order_by(asc(Task.title))
    else:
        query = query.order_by(desc(Task.created_at))

    result = await session.execute(query)
    return result.scalars().all()

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    request: Request = Depends(),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Create a new task for the authenticated user."""
    db_task = Task(
        **task_data.model_dump(),
        user_id=current_user_id
    )
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.get("/{id}", response_model=TaskRead)
async def get_task(
    id: int,
    request: Request = Depends(),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Get a specific task by ID, ensuring ownership."""
    db_task = await session.get(Task, id)
    if not db_task or db_task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return db_task

@router.put("/{id}", response_model=TaskRead)
async def update_task(
    id: int,
    task_data: TaskUpdate,
    request: Request = Depends(),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Update a specific task, ensuring ownership."""
    db_task = await session.get(Task, id)
    if not db_task or db_task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    obj_data = task_data.model_dump(exclude_unset=True)
    for key, value in obj_data.items():
        setattr(db_task, key, value)

    db_task.updated_at = datetime.now(timezone.utc)
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    id: int,
    request: Request = Depends(),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Delete a specific task, ensuring ownership."""
    db_task = await session.get(Task, id)
    if not db_task or db_task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await session.delete(db_task)
    await session.commit()
    return None

@router.patch("/{id}/complete", response_model=TaskRead)
async def toggle_task_completion(
    id: int,
    request: Request = Depends(),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Toggle the completion status of a task."""
    db_task = await session.get(Task, id)
    if not db_task or db_task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    db_task.completed = not db_task.completed
    db_task.updated_at = datetime.now(timezone.utc)

    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

from sqlalchemy import Column, Integer, String, Boolean, Text
from database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String)
    date = Column(String, nullable=False)
    slot = Column(String, nullable=False)
    reminder_sent = Column(Boolean, default=False)
    feedback_sent = Column(Boolean, default=False)
    status = Column(String, default="scheduled")  # scheduled, confirmed, completed, cancelled
    notes = Column(Text, nullable=True)  # For cancellation reasons, etc.
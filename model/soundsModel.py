from sqlalchemy import Column, Integer, String, Float
from database import Base
class Sound(Base):
    __tablename__ = 'sounds'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(50), nullable=False)
    icon = Column(String(10), nullable=False)
    file_path = Column(String(255), nullable=False)
    default_volume = Column(Float, default=0.5)
    category = Column(String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'display_name': self.display_name,
            'icon': self.icon,
            'file_path': self.file_path,
            'default_volume': self.default_volume,
            'category': self.category
        }
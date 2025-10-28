# server/app/constants.py

# Activity type to carbon conversion mapping (kg CO2)
ACTIVITY_CONVERSIONS = {
    'Cycling': {'unit': 'km', 'conversion': 0.21},
    'Public Transit': {'unit': 'km', 'conversion': 0.089},
    'Walking': {'unit': 'km', 'conversion': 0},
    'Vegetarian Meal': {'unit': 'meals', 'conversion': 2.5},
    'Recycling': {'unit': 'kg', 'conversion': 1.5},
    'Energy Conservation': {'unit': 'kWh', 'conversion': 0.92},
    'Water Conservation': {'unit': 'liters', 'conversion': 0.0002},
}
export const generateAISuggestion = (activities) => {
  if (!activities || activities.length === 0) {
    return {
      title: "Start Your Green Journey!",
      message: "Log your first eco-friendly activity to get personalized AI suggestions."
    };
  }

  const categoryCounts = {};
  let totalCarbon = 0;
  activities.forEach(act => {
    const cat = (act.category || 'other').toLowerCase();
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    totalCarbon += parseFloat(act.carbon_saved) || 0;
  });

  const topCategory = Object.keys(categoryCounts).reduce((a, b) =>
    categoryCounts[a] > categoryCounts[b] ? a : b
  );

  if (topCategory === 'transport') {
    return {
      title: "Transport Tip 💡",
      message: "You're logging lots of transport activities! Consider switching short car trips to cycling or walking to save even more CO₂."
    };
  } else if (['food', 'meals'].includes(topCategory)) {
    return {
      title: "Food Insight 🥦",
      message: "Great work on food-related activities! Try adding one more vegetarian meal per week to reduce your footprint further."
    };
  } else if (['purchases', 'shopping'].includes(topCategory)) {
    return {
      title: "Sustainable Shopping 🛍️",
      message: "You're mindful of your purchases! Look for products with minimal packaging or buy second-hand to amplify your impact."
    };
  } else if (totalCarbon > 50) {
    return {
      title: "Outstanding Impact! 🌍",
      message: `You've saved over ${totalCarbon.toFixed(1)} kg of CO₂ — that’s equivalent to planting ${Math.round(totalCarbon / 10)} trees! Keep going!`
    };
  } else {
    return {
      title: "Keep It Up! 🌱",
      message: `You’ve logged ${activities.length} activities. Consistency is key — try adding one new eco-habit this week!`
    };
  }
};
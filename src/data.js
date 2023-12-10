const recipes = [
    {
        id: "1",
        name: "Lasagna",
        favorite: false,
        ingredients: [
            { name: "sweet Italian sausage", amount: "1", unit: "lb", type: "dry" },
            { name: "ground beef", amount: "3/4", unit: "lb", type: "dry" },
            { name: "onion chopped", amount: "1/2", unit: "cup", type: "dry" },
            { name: "garlic", amount: "2", unit: "clove", type: "dry" },
            { name: "tomato", amount: "28", unit: "oz", type: "dry" },
            { name: "tomato sauce", amount: "12", unit: "oz", type: "dry" },
            { name: "white sugar", amount: "2", unit: "tbsp", type: "dry" },
            { name: "parsley", amount: "4", unit: "tbsp", type: "dry" },
            { name: "basil leaf", amount: "1 1/2", unit: "lb", type: "dry" },
            { name: "salt", amount: "1", unit: "tsp", type: "dry" },
            { name: "fennel seed", amount: "1/2", unit: "tsp", type: "dry" },
            { name: "lasagna noodle", amount: "12", unit: "none", type: "dry" },
            { name: "ricotta cheese", amount: "16", unit: "oz", type: "dry" },
            { name: "egg", amount: "1", unit: "none", type: "dry" },
            { name: "mozzarella cheese", amount: "3/4", unit: "cup", type: "dry" },
            { name: "parmesan cheese", amount: "3/4", unit: "cup", type: "dry" },
        ],
        method: `Gather all your ingredients. 
              Cook sausage, ground beef, onion, and garlic in a Dutch oven over medium heat until well browned. 
              Stir in crushed tomatoes, tomato sauce, tomato paste, and water. 
              Season with sugar, 2 tablespoons parsley, basil, 1 teaspoon salt, Italian seasoning, fennel seeds, and pepper. 
              Simmer, covered, for about 1 1/2 hours, stirring occasionally. Bring a large pot of lightly salted water to a boil. 
              Cook lasagna noodles in boiling water for 8 to 10 minutes. 
              Drain noodles, and rinse with cold water. 
              In a mixing bowl, combine ricotta cheese with egg, remaining 2 tablespoons parsley, and 1/2 teaspoon salt. 
              Preheat the oven to 375 degrees F (190 degrees C). 
              To assemble, spread 1 1/2 cups of meat sauce in the bottom of a 9x13-inch baking dish. Arrange 6 noodles lengthwise over meat sauce. 
              Spread with 1/2 of the ricotta cheese mixture. 
              Top with 1/3 of the mozzarella cheese slices. Spoon 1 1/2 cups meat sauce over mozzarella, and sprinkle with 1/4 cup Parmesan cheese. 
              Repeat layers, and top with remaining mozzarella and Parmesan cheese. 
              Cover with foil: to prevent sticking, either spray foil with cooking spray or make sure the foil does not touch the cheese.
              Bake in the preheated oven for 25 minutes. 
              Remove the foil and bake for an additional 25 minutes.Rest lasagna for 15 minutes before serving.`

    },
    {
        id: "2",
        name: "Chicken Tikka Masala",
        favorite: true,
        ingredients: [
            { name: "chicken", amount: "1 2/3", unit: "lb", type: "dry" },
            { name: "yogurt", amount: "3/4", unit: "lb", type: "dry" },
            { name: "ginger", amount: "1", unit: "tbsp", type: "dry" },
            { name: "garam masala", amount: "2", unit: "tsp", type: "dry" },
            { name: "turmeric", amount: "1", unit: "tsp", type: "dry" },
            { name: "cumin", amount: "1", unit: "tsp", type: "dry" },
            { name: "kashmiri chili", amount: "2", unit: "tsp", type: "dry" },
            { name: "vegetable oil", amount: "2", unit: "tbsp", type: "wet" },
            { name: "salt", amount: "1", unit: "tsp", type: "dry" },
            { name: "butter", amount: "2", unit: "tbsp", type: "dry" },
            { name: "onion", amount: "1", unit: "none", type: "dry" },
            { name: "garlic paste", amount: "1 1/2", unit: "cup", type: "wet" },
            { name: "tomato puree", amount: "14", unit: "oz", type: "dry" },
            { name: "red chili powder", amount: "1", unit: "tsp", type: "dry" },
            { name: "heavy cream", amount: "1 1/4", unit: "cup", type: "wet" },
            { name: "brown sugar", amount: "1", unit: "tsp", type: "dry" },
            { name: "cilantro", amount: "4", unit: "tbsp", type: "dry" },
        ],
        method: `In a bowl, combine chicken with all of the ingredients for the chicken marinade; let marinate for 10 minutes to an hour (or overnight if time allows). 
    Heat oil in a large skillet or pot over medium-high heat. When sizzling, add chicken pieces in batches of two or three, making sure not to crowd the pan. Fry until browned for only 3 minutes on each side. Set aside and keep warm. (You will finish cooking the chicken in the sauce.)
    Melt the butter in the same pan. Fry the onions until soft (about 3 minutes) while scraping up any browned bits stuck on the bottom of the pan. 
    Add garlic and ginger and sauté for 1 minute until fragrant, then add garam masala, cumin, turmeric and coriander. Fry for about 20 seconds until fragrant, while stirring occasionally.
    Pour in the tomato puree, chili powders and salt. Let simmer for about 10-15 minutes, stirring occasionally until sauce thickens and becomes a deep brown red colour.
    Stir the cream and sugar through the sauce. Add the chicken and its juices back into the pan and cook for an additional 8-10 minutes until chicken is cooked through and the sauce is thick and bubbling. Pour in the water to thin out the sauce, if needed.
    Garnish with cilantro (coriander) and serve with hot garlic butter rice and fresh homemade Naan bread!
    `
    },

    {
        id: "3",
        name: "Pizza",
        favorite: false,
        ingredients: [
            { name: "sugar", amount:  "1" , unit: "tsp", type: "dry"},
            { name: "dry yeast", amount: "2", unit: "tsp",type: "dry"},
            { name: "all-purpose-flour", amount: "7", unit: "cup", type: "dry"},
            { name: "extra virgin olive oil", amount: "1", unit: "tbsp",type: "wet"},
            { name: "garam masala", amount: "6", unit: "tbsp", type: "dry"},
            { name: "salt", amount:"1", unit: "tsp", type: "dry"},
            { name: "samolina flour", amount: "1/4", unit: "cup", type: "dry"},
            { name: "tomato", amount: "28", unit: "oz", type: "dry"},
            { name: "tomato sauce", amount: "2", unit: "tbsp", type: "dry"},
            { name: "mozzarella cheese", amount: "1/2", unit: "lb", type: "dry"},
            { name: "butter", amount: "2", unit: "tbsp", type: "dry"},
            { name: "onion", amount: "1", unit: "none", type: "dry"},
            { name: "garlic paste", amount: "1.5", unit: "tbsp",type: "wet"},
            { name: "tomato puree", amount: "14", unit: "oz", type: "dry"},
            { name: "red chili powder", amount: "1", unit: "tsp",type: "dry"},
            { name: "heavy cream", amount: "1.25", unit: "cup",type: 'wet'},
            { name: "brown sugar", amount: "1", unit: "tsp", type: "dry"},
            { name: "cilantro", amount: "4", unit: "tbsp",type: "dry"},
        ],
        method: `"Bloom" the yeast by sprinkling the sugar and yeast in the warm water. Let sit for 10 minutes, until bubbles form on the surface.
        In a large bowl, combine the flour and salt. Make a well in the middle and add the olive oil and bloomed yeast mixture. Using a spoon, mix until a shaggy dough begins to form.
        Once the flour is mostly hydrated, turn the dough out onto a clean work surface and knead for 10-15 minutes. The dough should be soft, smooth, and bouncy. Form the dough into a taut round.
        Grease a clean, large bowl with olive oil and place the dough inside, turning to coat with the oil. Cover with plastic wrap. Let rise for at least an hour, or up to 24 hours.
        Punch down the dough and turn it out onto a lightly floured work surface. Knead for another minute or so, then cut into 4 equal portions and shape into rounds.
        Lightly flour the dough, then cover with a kitchen towel and let rest for another 30 minutes to an hour while you prepare the sauce and any other ingredients.
        Preheat the oven as high as your oven will allow, between 450-500˚F (230-260˚C). Place a pizza stone, heavy baking sheet (turn upside down so the surface is flat), or cast iron skillet in the oven.
        Meanwhile, make the tomato sauce: Add the salt to the can of tomatoes and puree with an immersion blender, or transfer to a blender or food processor, and puree until smooth.
        Once the dough has rested, take a portion and start by poking the surface with your fingertips, until bubbles form and do not deflate.
        Then, stretch and press the dough into a thin round. Make it thinner than you think it should be, as it will slightly shrink and puff up during baking.
        Sprinkle semolina onto an upside down baking sheet and place the stretched crust onto it. Add the sauce and ingredients of your choice.
        Slide the pizza onto the preheated pizza stone or pan. Bake for 15 minutes, or until the crust and cheese are golden brown.
        Add any garnish of your preference.
        Nutrition Calories: 1691 Fat: 65 grams Carbs: 211 grams Fiber: 12 grams Sugars: 60 grams Protein: 65 grams
        Enjoy!`

    },
    {   
        id: "4",
        name: "Biryani",
        favorite: true,
        ingredients: [
            { name: "onion", amount: "7", unit: "oz", type: "dry"},
            { name: "bay leaf", amount:  "2" , unit: "none", type: "dry"},
            { name: "cilantro", amount: "2", unit: "tbsp", type: "dry"},
            { name: "star anise", amount: "1", unit: "none", type: "dry"},
            { name: "green cardamom", amount: "10", unit: "none",type: "dry"},
            { name: "cinnamon", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "black cardamom", amount: "1", unit: "none", type: "dry"},
            { name: "fennel seed", amount:"1.5", unit: "tsp", type: "dry"},
            { name: "black pepper", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "garlic", amount: "8", unit: "clove", type: "dry"},
            { name: "caraway seed", amount: "1", unit: "tsp", type: "dry"},
            { name: "mace", amount: "1/2", unit: "none", type: "dry"},
            { name: "nutmeg", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "chicken", amount: "1", unit: "lb", type: "dry"},
            { name: "yogurt", amount: "3", unit: "tbsp", type: "dry"},
            { name: "ginger garlic paste", amount: "1 1/4", unit: "tbsp", type: "wet"},
            { name: "garam masala", amount: "1", unit: "tbsp", type: "dry" },
            { name: "salt", amount: "1/2", unit: "tsp", type: "dry"},
            { name: "turmeric", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "lemon juice", amount: "1", unit: "tbsp", type: "wet"},
            { name: "green chili", amount: "1", unit: "none", type: "dry"},
            { name: "mint leaf", amount: "2", unit: "tbsp", type: "dry"},
            { name: "rice", amount: "1 1/2", unit: "cup", type: "dry"},
            { name: "ghee", amount: "1 1/2", unit: "tbsp", type: 'wet'},
            { name: "saffron strand", amount: "12", unit: "none", type: "dry"},
            { name: "milk", amount: "2", unit: "tbsp", type: 'wet'},
        ],
        method: `
        Mix Marinade in a large pot (about 26cm / 11" diameter). Add chicken and coat well. Marinade 20 minutes to overnight.
        Bring 3 litres / 3 quarts water to the boil, add salt and spices.
        Add rice, bring back up to the boil then cook for 4 minutes, or until rice is just cooked still a bit firm in the middle. Rice will taste salty at this stage, disappears in next stage of cooking.
        Drain immediately. Set aside. (Note 10 re: leaving whole spices in)
        Heat oil in a large saucepan over medium high heat. Cook onion, in batches, for 3 to 4 minutes, until golden brown. Don't burn - they become bitter.
        Remove onto paper towel lined plate. Repeat with remaining onion.
        Place in a bowl, leave for 10 minutes+.
        Place pot with chicken in it onto a stove over medium heat. Cover and cook for 5 minutes.
        Remove lid. Cook for 5 minutes, turning chicken twice.
        Remove from heat.
        Turn chicken so skin side is down - it should cover most of the base of the pot.
        Scatter over half the onion then half the coriander.
        Top with all the rice. Gently pat down and flatten surface.
        Drizzle saffron across rice surface in random pattern, then drizzle over ghee.
        Place lid on. Return to stove over medium heat.
        As soon as you see steam, turn down to low then cook for 25 minutes.
        Remove from stove, rest with lid on for 10 minutes.
        Aim to serve it so you get nice patches of yellow rice, white rice, the curry stained rice + chicken (rather than all mixed up). To do this, use a large spoon and dig deep into the pot, and try to scoop up as much as you can in one scoop.
        Turn out into bowl - or onto platter. Garnish with remaining onion and coriander with yoghurt on the side (see Note 7 for Minted Yoghurt)`
    },
    {
        id: "5",
        name: "Chinese Rice",
        favorite: true,
        ingredients: [  
            { name: "baby carrot", amount:  "2/3" , unit: "cup", type: "dry"},
            { name: "green pea", amount: "1/2", unit: "cup", type: "dry"},
            { name: "vegetable oil", amount: "2", unit: "tbsp", type: 'wet'},
            { name: "garlic", amount: "1", unit: "clove", type: "dry"},
            { name: "egg", amount: "2", unit: "none", type: "dry"},
            { name: "rice", amount:"3", unit: "cup", type: "dry"},
            { name: "soy sauce", amount: "1", unit: "tbsp", type: 'wet'},
            { name: "sesame oil", amount: "2", unit: "tsp", type: 'wet'},
            { name: "salt", amount: "1", unit: "tsp", type: "dry"},
        ],
        method: `Assemble ingredients.
        Place carrots in a small saucepan and cover with water. Bring to a low boil and cook for 3 to 5 minutes. Stir in peas, then immediately drain in a colander.
        Heat a wok over high heat. Pour in vegetable oil, then stir in carrots, peas, and garlic; cook for about 30 seconds. Add eggs; stir quickly to scramble eggs with vegetables.
        Stir in cooked rice. Add soy sauce and toss rice to coat. Drizzle with sesame oil and toss again.
        Serve hot and enjoy!`
    },
    // {
    //     id: "6",
    //     name: "Christmas pie",

    //     ingredients: [
    //         { name: "olive oil", amount:  "2" , unit: "mL", type: 'wet'},
    //         { name: "butter", amount: "1", unit: "g", type: "dry"},
    //         { name: "onion", amount: "1", unit: "none", type: "dry"},
    //         { name: "sausage meat", amount: "500", unit: "g", type: "dry"},
    //         { name: "lemon", amount: "1", unit: "none", type: "dry"},
    //         { name: "bread crumbs", amount:"100", unit: "g", type: "dry"},
    //         { name: "dried apricots", amount: "85", unit: "g", type: "dry"},
    //         { name: "chestnut", amount: "50", unit: "g", type: "dry"},
    //         { name: "dried thyme", amount: "1", unit: "g", type: "dry"},
    //         { name: "cranberry", amount:"100", unit: "g", type: "dry"},
    //         { name: "boneless chicken breast", amount: "500", unit: "g", type: "dry"},
    //         { name: "shortcrust pastry", amount: "500", unit: "g", type: "dry"},
    //         { name: "egg", amount: "1", unit: "none", type: "dry"},
    //     ],
    //     method: 
    //       `Heat oven to 190C/fan 170C/gas 5. Heat 1 tbsp oil and the butter in a frying pan, then add the onion and fry for 5 mins until softened. Cool slightly. Tip the sausage meat, lemon zest, breadcrumbs, apricots, chestnuts and thyme into a bowl. Add the onion and cranberries, and mix everything together with your hands, adding plenty of pepper and a little salt.
    //       Cut each chicken breast into three fillets lengthwise and season all over with salt and pepper. Heat the remaining oil in the frying pan, and fry the chicken fillets quickly until browned, about 6-8 mins.
    //       Roll out two-thirds of the pastry to line a 20-23cm spring form or deep loose-based tart tin. Press in half the sausage mix and spread to level. Then add the chicken pieces in one layer and cover with the rest of the sausage. Press down lightly.
    //       Roll out the remaining pastry. Brush the edges of the pastry with beaten egg and cover with the pastry lid. Pinch the edges to seal, then trim. Brush the top of the pie with egg, then roll out the trimmings to make holly leaf shapes and berries. Decorate the pie and brush again with egg.
    //       Set the tin on a baking sheet and bake for 50-60 mins, then cool in the tin for 15 mins. Remove and leave to cool completely. Serve with a winter salad and pickles.`

    // },
    {
        id: "7",
        name: "Lasagna 2",
        favorite: false,
        ingredients: [
            { name: "sweet Italian sausage", amount: "1", unit: "lb", type: "dry"},
            { name: "ground beef", amount: "3/4", unit: "lb", type: "dry"},
            { name: "onion chopped", amount: "1/2", unit: "cup", type: "dry"},
            { name: "garlic", amount: "2", unit: "clove", type: "dry"},
            { name: "tomato", amount: "28", unit: "oz", type: "dry"},
            { name: "tomato sauce", amount:"12", unit: "oz", type: "dry"},
            { name: "white sugar", amount: "2", unit: "tbsp",type: "dry"},
            { name: "parsley", amount: "4", unit: "tbsp", type: "dry"},
            { name: "basil leaf", amount: "1 1/2", unit: "lb", type: "dry"},
            { name: "salt", amount: "1", unit: "tsp",type: "dry"},
            { name: "fennel seed", amount: "1/2", unit: "tsp",type: "dry"},
            { name: "lasagna noodle", amount: "12", unit: "none",type: "dry"},
            { name: "ricotta cheese", amount: "16", unit: "oz",type: "dry"},
            { name: "egg", amount: "1", unit: "none",type: "dry"},
            { name: "mozzarella cheese", amount: "3/4", unit: "cup",type: "dry"},
            { name: "parmesan cheese", amount: "3/4", unit: "cup",type: "dry"},
         ],
        method: `Gather all your ingredients. 
                  Cook sausage, ground beef, onion, and garlic in a Dutch oven over medium heat until well browned. 
                  Stir in crushed tomatoes, tomato sauce, tomato paste, and water. 
                  Season with sugar, 2 tablespoons parsley, basil, 1 teaspoon salt, Italian seasoning, fennel seeds, and pepper. 
                  Simmer, covered, for about 1 1/2 hours, stirring occasionally. Bring a large pot of lightly salted water to a boil. 
                  Cook lasagna noodles in boiling water for 8 to 10 minutes. 
                  Drain noodles, and rinse with cold water. 
                  In a mixing bowl, combine ricotta cheese with egg, remaining 2 tablespoons parsley, and 1/2 teaspoon salt. 
                  Preheat the oven to 375 degrees F (190 degrees C). 
                  To assemble, spread 1 1/2 cups of meat sauce in the bottom of a 9x13-inch baking dish. Arrange 6 noodles lengthwise over meat sauce. 
                  Spread with 1/2 of the ricotta cheese mixture. 
                  Top with 1/3 of the mozzarella cheese slices. Spoon 1 1/2 cups meat sauce over mozzarella, and sprinkle with 1/4 cup Parmesan cheese. 
                  Repeat layers, and top with remaining mozzarella and Parmesan cheese. 
                  Cover with foil: to prevent sticking, either spray foil with cooking spray or make sure the foil does not touch the cheese.
                  Bake in the preheated oven for 25 minutes. 
                  Remove the foil and bake for an additional 25 minutes.Rest lasagna for 15 minutes before serving.`

    },
    {
        id: "8",
        name: "Chicken Tikka Masala 2",
        favorite: true,
        ingredients: [
            { name: "chicken", amount:  "1 3/4" , unit: "lb", type: "dry"},
            { name: "yogurt", amount: "3/4", unit: "lb", type: "dry"},
            { name: "ginger", amount: "1", unit: "tbsp",type: "dry"},
            { name: "garam masala", amount: "2", unit: "tsp",type: "dry"},
            { name: "turmeric", amount:"1", unit: "tsp",type: "dry"},
            { name: "cumin", amount: "1", unit: "tsp",type: "dry"},
            { name: "kashmiri chili", amount: "2", unit: "tsp",type: "dry"},
            { name: "vegetable oil", amount: "2", unit: "tbsp", type: 'wet'},
            { name: "salt", amount: "1", unit: "tsp",type: "dry"},
            { name: "butter", amount: "2", unit: "tbsp",type: "dry"},
            { name: "onion", amount: "1", unit: "none",type: "dry"},
            { name: "garlic paste", amount: "1 1/2", unit: "tbsp",type: "wet"},
            { name: "tomato puree", amount: "14", unit: "oz",type: "dry"},
            { name: "red chili powder", amount: "1", unit: "tsp",type: "dry"},
            { name: "heavy cream", amount: "1 1/4", unit: "cup",type: "wet"},
            { name: "brown sugar", amount: "1", unit: "tsp",type: "dry"},
            { name: "cilantro", amount: "4", unit: "tbsp",type: "dry"},
        ],
        method: `In a bowl, combine chicken with all of the ingredients for the chicken marinade; let marinate for 10 minutes to an hour (or overnight if time allows). 
        Heat oil in a large skillet or pot over medium-high heat. When sizzling, add chicken pieces in batches of two or three, making sure not to crowd the pan. Fry until browned for only 3 minutes on each side. Set aside and keep warm. (You will finish cooking the chicken in the sauce.)
        Melt the butter in the same pan. Fry the onions until soft (about 3 minutes) while scraping up any browned bits stuck on the bottom of the pan. 
        Add garlic and ginger and sauté for 1 minute until fragrant, then add garam masala, cumin, turmeric and coriander. Fry for about 20 seconds until fragrant, while stirring occasionally.
        Pour in the tomato puree, chili powders and salt. Let simmer for about 10-15 minutes, stirring occasionally until sauce thickens and becomes a deep brown red colour.
        Stir the cream and sugar through the sauce. Add the chicken and its juices back into the pan and cook for an additional 8-10 minutes until chicken is cooked through and the sauce is thick and bubbling. Pour in the water to thin out the sauce, if needed.
        Garnish with cilantro (coriander) and serve with hot garlic butter rice and fresh homemade Naan bread!
        `
    },
    {
        id: "9",
        name: "Pizza 2",
        favorite: false,
        ingredients: [
            { name: "sugar", amount:  "1" , unit: "tsp", type: "dry"},
            { name: "dry yeast", amount: "2", unit: "tsp",type: "dry"},
            { name: "all-purpose-flour", amount: "7", unit: "cup", type: "dry"},
            { name: "extra virgin olive oil", amount: "1", unit: "tbsp",type: "wet"},
            { name: "garam masala", amount: "6", unit: "tbsp", type: "dry"},
            { name: "salt", amount:"1", unit: "tsp", type: "dry"},
            { name: "samolina flour", amount: "1/4", unit: "cup", type: "dry"},
            { name: "tomato", amount: "28", unit: "oz", type: "dry"},
            { name: "tomato sauce", amount: "2", unit: "tbsp", type: "dry"},
            { name: "mozzarella cheese", amount: "1/2", unit: "lb", type: "dry"},
            { name: "butter", amount: "2", unit: "tbsp", type: "dry"},
            { name: "onion", amount: "1", unit: "none", type: "dry"},
            { name: "garlic paste", amount: "1.5", unit: "tbsp",type: "wet"},
            { name: "tomato puree", amount: "14", unit: "oz", type: "dry"},
            { name: "red chili powder", amount: "1", unit: "tsp",type: "dry"},
            { name: "heavy cream", amount: "1.25", unit: "cup",type: 'wet'},
            { name: "brown sugar", amount: "1", unit: "tsp", type: "dry"},
            { name: "cilantro", amount: "4", unit: "tbsp",type: "dry"},
        ],
        method: `"Bloom" the yeast by sprinkling the sugar and yeast in the warm water. Let sit for 10 minutes, until bubbles form on the surface.
        In a large bowl, combine the flour and salt. Make a well in the middle and add the olive oil and bloomed yeast mixture. Using a spoon, mix until a shaggy dough begins to form.
        Once the flour is mostly hydrated, turn the dough out onto a clean work surface and knead for 10-15 minutes. The dough should be soft, smooth, and bouncy. Form the dough into a taut round.
        Grease a clean, large bowl with olive oil and place the dough inside, turning to coat with the oil. Cover with plastic wrap. Let rise for at least an hour, or up to 24 hours.
        Punch down the dough and turn it out onto a lightly floured work surface. Knead for another minute or so, then cut into 4 equal portions and shape into rounds.
        Lightly flour the dough, then cover with a kitchen towel and let rest for another 30 minutes to an hour while you prepare the sauce and any other ingredients.
        Preheat the oven as high as your oven will allow, between 450-500˚F (230-260˚C). Place a pizza stone, heavy baking sheet (turn upside down so the surface is flat), or cast iron skillet in the oven.
        Meanwhile, make the tomato sauce: Add the salt to the can of tomatoes and puree with an immersion blender, or transfer to a blender or food processor, and puree until smooth.
        Once the dough has rested, take a portion and start by poking the surface with your fingertips, until bubbles form and do not deflate.
        Then, stretch and press the dough into a thin round. Make it thinner than you think it should be, as it will slightly shrink and puff up during baking.
        Sprinkle semolina onto an upside down baking sheet and place the stretched crust onto it. Add the sauce and ingredients of your choice.
        Slide the pizza onto the preheated pizza stone or pan. Bake for 15 minutes, or until the crust and cheese are golden brown.
        Add any garnish of your preference.
        Nutrition Calories: 1691 Fat: 65 grams Carbs: 211 grams Fiber: 12 grams Sugars: 60 grams Protein: 65 grams
        Enjoy!`

    },
    {
        id: "10",
        name: "Biryani 2",
        favorite: true,
        ingredients: [
            { name: "onion", amount: "7", unit: "oz", type: "dry"},
            { name: "bay leaf", amount:  "2" , unit: "none", type: "dry"},
            { name: "cilantro", amount: "2", unit: "tbsp", type: "dry"},
            { name: "star anise", amount: "1", unit: "none", type: "dry"},
            { name: "green cardamom", amount: "10", unit: "none",type: "dry"},
            { name: "cinnamon", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "black cardamom", amount: "1", unit: "none", type: "dry"},
            { name: "fennel seed", amount:"1.5", unit: "tsp", type: "dry"},
            { name: "black pepper", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "garlic", amount: "8", unit: "clove", type: "dry"},
            { name: "caraway seed", amount: "1", unit: "tsp", type: "dry"},
            { name: "mace", amount: "1/2", unit: "none", type: "dry"},
            { name: "nutmeg", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "chicken", amount: "1", unit: "lb", type: "dry"},
            { name: "yogurt", amount: "3", unit: "tbsp", type: "dry"},
            { name: "ginger garlic paste", amount: "1 1/4", unit: "tbsp", type: "wet"},
            { name: "garam masala", amount: "1", unit: "tbsp", type: "dry" },
            { name: "salt", amount: "1/2", unit: "tsp", type: "dry"},
            { name: "turmeric", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "lemon juice", amount: "1", unit: "tbsp", type: "wet"},
            { name: "green chili", amount: "1", unit: "none", type: "dry"},
            { name: "mint leaf", amount: "2", unit: "tbsp", type: "dry"},
            { name: "rice", amount: "1 1/2", unit: "cup", type: "dry"},
            { name: "ghee", amount: "1 1/2", unit: "tbsp", type: 'wet'},
            { name: "saffron strand", amount: "12", unit: "none", type: "dry"},
            { name: "milk", amount: "2", unit: "tbsp", type: 'wet'},
        ],
        method: 
        `Mix Marinade in a large pot (about 26cm / 11" diameter). Add chicken and coat well. Marinade 20 minutes to overnight.
        Bring 3 litres / 3 quarts water to the boil, add salt and spices.
        Add rice, bring back up to the boil then cook for 4 minutes, or until rice is just cooked still a bit firm in the middle. Rice will taste salty at this stage, disappears in next stage of cooking.
        Drain immediately. Set aside. (Note 10 re: leaving whole spices in)
        Heat oil in a large saucepan over medium high heat. Cook onion, in batches, for 3 to 4 minutes, until golden brown. Don't burn - they become bitter.
        Remove onto paper towel lined plate. Repeat with remaining onion.
        Place in a bowl, leave for 10 minutes+.
        Place pot with chicken in it onto a stove over medium heat. Cover and cook for 5 minutes.
        Remove lid. Cook for 5 minutes, turning chicken twice.
        Remove from heat.
        Turn chicken so skin side is down - it should cover most of the base of the pot.
        Scatter over half the onion then half the coriander.
        Top with all the rice. Gently pat down and flatten surface.
        Drizzle saffron across rice surface in random pattern, then drizzle over ghee.
        Place lid on. Return to stove over medium heat.
        As soon as you see steam, turn down to low then cook for 25 minutes.
        Remove from stove, rest with lid on for 10 minutes.
        Aim to serve it so you get nice patches of yellow rice, white rice, the curry stained rice + chicken (rather than all mixed up). To do this, use a large spoon and dig deep into the pot, and try to scoop up as much as you can in one scoop.
        Turn out into bowl - or onto platter. Garnish with remaining onion and coriander with yoghurt on the side (see Note 7 for Minted Yoghurt)`
    },
    // {
    //     id: "11",
    //     name: "Christmas pie 2",

    //     ingredients: [
    //         { name: "olive oil", amount:  "2" , unit: "mL", type: 'wet'},
    //         { name: "butter", amount: "400", unit: "g", type: "dry"},
    //         { name: "onion", amount: "1", unit: "none", type: "dry"},
    //         { name: "sausage meat", amount: "500", unit: "g", type: "dry"},
    //         { name: "lemon", amount: "1", unit: "none", type: "dry"},
    //         { name: "bread crumbs", amount:"100", unit: "g", type: "dry"},
    //         { name: "dried apricots", amount: "85", unit: "g", type: "dry"},
    //         { name: "chestnut", amount: "50", unit: "g", type: "dry"},
    //         { name: "dried thyme", amount: "1", unit: "g", type: "dry"},
    //         { name: "cranberry", amount:"100", unit: "g", type: "dry"},
    //         { name: "boneless chicken breast", amount: "500", unit: "g", type: "dry"},
    //         { name: "shortcrust pastry", amount: "500", unit: "g", type: "dry"},
    //         { name: "egg", amount: "1", unit: "none", type: "dry"},
    //     ],
    //     method: 
    //       `Heat oven to 190C/fan 170C/gas 5. Heat 1 tbsp oil and the butter in a frying pan, then add the onion and fry for 5 mins until softened. Cool slightly. Tip the sausage meat, lemon zest, breadcrumbs, apricots, chestnuts and thyme into a bowl. Add the onion and cranberries, and mix everything together with your hands, adding plenty of pepper and a little salt.
    //       Cut each chicken breast into three fillets lengthwise and season all over with salt and pepper. Heat the remaining oil in the frying pan, and fry the chicken fillets quickly until browned, about 6-8 mins.
    //       Roll out two-thirds of the pastry to line a 20-23cm spring form or deep loose-based tart tin. Press in half the sausage mix and spread to level. Then add the chicken pieces in one layer and cover with the rest of the sausage. Press down lightly.
    //       Roll out the remaining pastry. Brush the edges of the pastry with beaten egg and cover with the pastry lid. Pinch the edges to seal, then trim. Brush the top of the pie with egg, then roll out the trimmings to make holly leaf shapes and berries. Decorate the pie and brush again with egg.
    //       Set the tin on a baking sheet and bake for 50-60 mins, then cool in the tin for 15 mins. Remove and leave to cool completely. Serve with a winter salad and pickles.`

    // },
    {
        id: "12",
        name: "Chinese Rice2",
        favorite: true,
        ingredients: [  
            { name: "baby carrot", amount:  "2/3" , unit: "cup", type: "dry"},
            { name: "green pea", amount: "1/2", unit: "cup", type: "dry"},
            { name: "vegetable oil", amount: "2", unit: "tbsp", type: 'wet'},
            { name: "garlic", amount: "1", unit: "clove", type: "dry"},
            { name: "egg", amount: "2", unit: "none", type: "dry"},
            { name: "rice", amount:"3", unit: "cup", type: "dry"},
            { name: "soy sauce", amount: "1", unit: "tbsp", type: 'wet'},
            { name: "sesame oil", amount: "2", unit: "tsp", type: 'wet'},
            { name: "salt", amount: "1", unit: "tsp", type: "dry"},
        ],
        method: `Assemble ingredients.
        Place carrots in a small saucepan and cover with water. Bring to a low boil and cook for 3 to 5 minutes. Stir in peas, then immediately drain in a colander.
        Heat a wok over high heat. Pour in vegetable oil, then stir in carrots, peas, and garlic; cook for about 30 seconds. Add eggs; stir quickly to scramble eggs with vegetables.
        Stir in cooked rice. Add soy sauce and toss rice to coat. Drizzle with sesame oil and toss again.
        Serve hot and enjoy!`
    },
    {
        id: "13",
        name: "Lasagna3",
        favorite: false,
        ingredients: [
            { name: "sweet Italian sausage", amount: "1", unit: "lb", type: "dry" },
            { name: "ground beef", amount: "3/4", unit: "lb", type: "dry" },
            { name: "onion chopped", amount: "1/2", unit: "cup", type: "dry" },
            { name: "garlic", amount: "2", unit: "clove", type: "dry" },
            { name: "tomato", amount: "28", unit: "oz", type: "dry" },
            { name: "tomato sauce", amount: "12", unit: "oz", type: "dry" },
            { name: "white sugar", amount: "2", unit: "tbsp", type: "dry" },
            { name: "parsley", amount: "4", unit: "tbsp", type: "dry" },
            { name: "basil leaf", amount: "1 1/2", unit: "lb", type: "dry" },
            { name: "salt", amount: "1", unit: "tsp", type: "dry" },
            { name: "fennel seed", amount: "1/2", unit: "tsp", type: "dry" },
            { name: "lasagna noodle", amount: "12", unit: "none", type: "dry" },
            { name: "ricotta cheese", amount: "16", unit: "oz", type: "dry" },
            { name: "egg", amount: "1", unit: "none", type: "dry" },
            { name: "mozzarella cheese", amount: "3/4", unit: "cup", type: "dry" },
            { name: "parmesan cheese", amount: "3/4", unit: "cup", type: "dry" },
        ],
        method: `Gather all your ingredients. 
              Cook sausage, ground beef, onion, and garlic in a Dutch oven over medium heat until well browned. 
              Stir in crushed tomatoes, tomato sauce, tomato paste, and water. 
              Season with sugar, 2 tablespoons parsley, basil, 1 teaspoon salt, Italian seasoning, fennel seeds, and pepper. 
              Simmer, covered, for about 1 1/2 hours, stirring occasionally. Bring a large pot of lightly salted water to a boil. 
              Cook lasagna noodles in boiling water for 8 to 10 minutes. 
              Drain noodles, and rinse with cold water. 
              In a mixing bowl, combine ricotta cheese with egg, remaining 2 tablespoons parsley, and 1/2 teaspoon salt. 
              Preheat the oven to 375 degrees F (190 degrees C). 
              To assemble, spread 1 1/2 cups of meat sauce in the bottom of a 9x13-inch baking dish. Arrange 6 noodles lengthwise over meat sauce. 
              Spread with 1/2 of the ricotta cheese mixture. 
              Top with 1/3 of the mozzarella cheese slices. Spoon 1 1/2 cups meat sauce over mozzarella, and sprinkle with 1/4 cup Parmesan cheese. 
              Repeat layers, and top with remaining mozzarella and Parmesan cheese. 
              Cover with foil: to prevent sticking, either spray foil with cooking spray or make sure the foil does not touch the cheese.
              Bake in the preheated oven for 25 minutes. 
              Remove the foil and bake for an additional 25 minutes.Rest lasagna for 15 minutes before serving.`

    },
    {
        id: "14",
        name: "Chicken Tikka Masala3",
        favorite: true,
        ingredients: [
            { name: "chicken", amount: "1 2/3", unit: "lb", type: "dry" },
            { name: "yogurt", amount: "3/4", unit: "lb", type: "dry" },
            { name: "ginger", amount: "1", unit: "tbsp", type: "dry" },
            { name: "garam masala", amount: "2", unit: "tsp", type: "dry" },
            { name: "turmeric", amount: "1", unit: "tsp", type: "dry" },
            { name: "cumin", amount: "1", unit: "tsp", type: "dry" },
            { name: "kashmiri chili", amount: "2", unit: "tsp", type: "dry" },
            { name: "vegetable oil", amount: "2", unit: "tbsp", type: "wet" },
            { name: "salt", amount: "1", unit: "tsp", type: "dry" },
            { name: "butter", amount: "2", unit: "tbsp", type: "dry" },
            { name: "onion", amount: "1", unit: "none", type: "dry" },
            { name: "garlic paste", amount: "1 1/2", unit: "cup", type: "wet" },
            { name: "tomato puree", amount: "14", unit: "oz", type: "dry" },
            { name: "red chili powder", amount: "1", unit: "tsp", type: "dry" },
            { name: "heavy cream", amount: "1 1/4", unit: "cup", type: "wet" },
            { name: "brown sugar", amount: "1", unit: "tsp", type: "dry" },
            { name: "cilantro", amount: "4", unit: "tbsp", type: "dry" },
        ],
        method: `In a bowl, combine chicken with all of the ingredients for the chicken marinade; let marinate for 10 minutes to an hour (or overnight if time allows). 
    Heat oil in a large skillet or pot over medium-high heat. When sizzling, add chicken pieces in batches of two or three, making sure not to crowd the pan. Fry until browned for only 3 minutes on each side. Set aside and keep warm. (You will finish cooking the chicken in the sauce.)
    Melt the butter in the same pan. Fry the onions until soft (about 3 minutes) while scraping up any browned bits stuck on the bottom of the pan. 
    Add garlic and ginger and sauté for 1 minute until fragrant, then add garam masala, cumin, turmeric and coriander. Fry for about 20 seconds until fragrant, while stirring occasionally.
    Pour in the tomato puree, chili powders and salt. Let simmer for about 10-15 minutes, stirring occasionally until sauce thickens and becomes a deep brown red colour.
    Stir the cream and sugar through the sauce. Add the chicken and its juices back into the pan and cook for an additional 8-10 minutes until chicken is cooked through and the sauce is thick and bubbling. Pour in the water to thin out the sauce, if needed.
    Garnish with cilantro (coriander) and serve with hot garlic butter rice and fresh homemade Naan bread!
    `
    },

    {
        id: "15",
        name: "Pizza3",
        favorite: false,
        ingredients: [
            { name: "sugar", amount:  "1" , unit: "tsp", type: "dry"},
            { name: "dry yeast", amount: "2", unit: "tsp",type: "dry"},
            { name: "all-purpose-flour", amount: "7", unit: "cup", type: "dry"},
            { name: "extra virgin olive oil", amount: "1", unit: "tbsp",type: "wet"},
            { name: "garam masala", amount: "6", unit: "tbsp", type: "dry"},
            { name: "salt", amount:"1", unit: "tsp", type: "dry"},
            { name: "samolina flour", amount: "1/4", unit: "cup", type: "dry"},
            { name: "tomato", amount: "28", unit: "oz", type: "dry"},
            { name: "tomato sauce", amount: "2", unit: "tbsp", type: "dry"},
            { name: "mozzarella cheese", amount: "1/2", unit: "lb", type: "dry"},
            { name: "butter", amount: "2", unit: "tbsp", type: "dry"},
            { name: "onion", amount: "1", unit: "none", type: "dry"},
            { name: "garlic paste", amount: "1.5", unit: "tbsp",type: "wet"},
            { name: "tomato puree", amount: "14", unit: "oz", type: "dry"},
            { name: "red chili powder", amount: "1", unit: "tsp",type: "dry"},
            { name: "heavy cream", amount: "1.25", unit: "cup",type: 'wet'},
            { name: "brown sugar", amount: "1", unit: "tsp", type: "dry"},
            { name: "cilantro", amount: "4", unit: "tbsp",type: "dry"},
        ],
        method: `"Bloom" the yeast by sprinkling the sugar and yeast in the warm water. Let sit for 10 minutes, until bubbles form on the surface.
        In a large bowl, combine the flour and salt. Make a well in the middle and add the olive oil and bloomed yeast mixture. Using a spoon, mix until a shaggy dough begins to form.
        Once the flour is mostly hydrated, turn the dough out onto a clean work surface and knead for 10-15 minutes. The dough should be soft, smooth, and bouncy. Form the dough into a taut round.
        Grease a clean, large bowl with olive oil and place the dough inside, turning to coat with the oil. Cover with plastic wrap. Let rise for at least an hour, or up to 24 hours.
        Punch down the dough and turn it out onto a lightly floured work surface. Knead for another minute or so, then cut into 4 equal portions and shape into rounds.
        Lightly flour the dough, then cover with a kitchen towel and let rest for another 30 minutes to an hour while you prepare the sauce and any other ingredients.
        Preheat the oven as high as your oven will allow, between 450-500˚F (230-260˚C). Place a pizza stone, heavy baking sheet (turn upside down so the surface is flat), or cast iron skillet in the oven.
        Meanwhile, make the tomato sauce: Add the salt to the can of tomatoes and puree with an immersion blender, or transfer to a blender or food processor, and puree until smooth.
        Once the dough has rested, take a portion and start by poking the surface with your fingertips, until bubbles form and do not deflate.
        Then, stretch and press the dough into a thin round. Make it thinner than you think it should be, as it will slightly shrink and puff up during baking.
        Sprinkle semolina onto an upside down baking sheet and place the stretched crust onto it. Add the sauce and ingredients of your choice.
        Slide the pizza onto the preheated pizza stone or pan. Bake for 15 minutes, or until the crust and cheese are golden brown.
        Add any garnish of your preference.
        Nutrition Calories: 1691 Fat: 65 grams Carbs: 211 grams Fiber: 12 grams Sugars: 60 grams Protein: 65 grams
        Enjoy!`

    },
    {   
        id: "16",
        name: "Biryani3",
        favorite: true,
        ingredients: [
            { name: "onion", amount: "7", unit: "oz", type: "dry"},
            { name: "bay leaf", amount:  "2" , unit: "none", type: "dry"},
            { name: "cilantro", amount: "2", unit: "tbsp", type: "dry"},
            { name: "star anise", amount: "1", unit: "none", type: "dry"},
            { name: "green cardamom", amount: "10", unit: "none",type: "dry"},
            { name: "cinnamon", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "black cardamom", amount: "1", unit: "none", type: "dry"},
            { name: "fennel seed", amount:"1.5", unit: "tsp", type: "dry"},
            { name: "black pepper", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "garlic", amount: "8", unit: "clove", type: "dry"},
            { name: "caraway seed", amount: "1", unit: "tsp", type: "dry"},
            { name: "mace", amount: "1/2", unit: "none", type: "dry"},
            { name: "nutmeg", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "chicken", amount: "1", unit: "lb", type: "dry"},
            { name: "yogurt", amount: "3", unit: "tbsp", type: "dry"},
            { name: "ginger garlic paste", amount: "1 1/4", unit: "tbsp", type: "wet"},
            { name: "garam masala", amount: "1", unit: "tbsp", type: "dry" },
            { name: "salt", amount: "1/2", unit: "tsp", type: "dry"},
            { name: "turmeric", amount: "1/4", unit: "tsp", type: "dry"},
            { name: "lemon juice", amount: "1", unit: "tbsp", type: "wet"},
            { name: "green chili", amount: "1", unit: "none", type: "dry"},
            { name: "mint leaf", amount: "2", unit: "tbsp", type: "dry"},
            { name: "rice", amount: "1 1/2", unit: "cup", type: "dry"},
            { name: "ghee", amount: "1 1/2", unit: "tbsp", type: 'wet'},
            { name: "saffron strand", amount: "12", unit: "none", type: "dry"},
            { name: "milk", amount: "2", unit: "tbsp", type: 'wet'},
        ],
        method: `
        Mix Marinade in a large pot (about 26cm / 11" diameter). Add chicken and coat well. Marinade 20 minutes to overnight.
        Bring 3 litres / 3 quarts water to the boil, add salt and spices.
        Add rice, bring back up to the boil then cook for 4 minutes, or until rice is just cooked still a bit firm in the middle. Rice will taste salty at this stage, disappears in next stage of cooking.
        Drain immediately. Set aside. (Note 10 re: leaving whole spices in)
        Heat oil in a large saucepan over medium high heat. Cook onion, in batches, for 3 to 4 minutes, until golden brown. Don't burn - they become bitter.
        Remove onto paper towel lined plate. Repeat with remaining onion.
        Place in a bowl, leave for 10 minutes+.
        Place pot with chicken in it onto a stove over medium heat. Cover and cook for 5 minutes.
        Remove lid. Cook for 5 minutes, turning chicken twice.
        Remove from heat.
        Turn chicken so skin side is down - it should cover most of the base of the pot.
        Scatter over half the onion then half the coriander.
        Top with all the rice. Gently pat down and flatten surface.
        Drizzle saffron across rice surface in random pattern, then drizzle over ghee.
        Place lid on. Return to stove over medium heat.
        As soon as you see steam, turn down to low then cook for 25 minutes.
        Remove from stove, rest with lid on for 10 minutes.
        Aim to serve it so you get nice patches of yellow rice, white rice, the curry stained rice + chicken (rather than all mixed up). To do this, use a large spoon and dig deep into the pot, and try to scoop up as much as you can in one scoop.
        Turn out into bowl - or onto platter. Garnish with remaining onion and coriander with yoghurt on the side (see Note 7 for Minted Yoghurt)`
    },
];
// localStorage.setItem("data", JSON.stringify(recipes));
// export default recipes;
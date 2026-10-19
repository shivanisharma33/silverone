/**
 * Project attribute cards.
 *
 * Every value is transcribed from the Company's own project pages — the
 * location sentence, the commodity suite named in the geology description,
 * and the stage each property is explicitly described as being at. Nothing
 * here is inferred.
 */

export type ProjectFacts = {
  /** Shown in the attribute card on the project page. */
  location: string;
  commodity: string;
  projectType: string;
  status: string;
  /** Short intro paragraph beneath the "Project Overview" heading. */
  overview: string;
  /** Photograph used beside the overview, and its caption. */
  overviewImage: string;
  overviewImageAlt: string;
  overviewCaption?: string;
  /** Closing band image and copy. */
  bandImage: string;
  bandImageAlt: string;
  bandTitle: string;
  bandBody: string;
  bandAction: string;
  bandHref: string;
};

export const PROJECT_FACTS: Record<string, ProjectFacts> = {
  candelaria: {
    location: 'Central-west Nevada, USA',
    commodity: 'Silver (Ag), Gold (Au)',
    projectType: 'Past-producing mine',
    status: 'Resource defined · Pre-Feasibility Study underway',
    overview:
      'The Candelaria Project is a past-producing silver mine in central-west Nevada, just off paved Highway 95 between Las Vegas and Reno. The past-producing minesite is serviced by paved road, power and water, and lies within the Candelaria Mining District — historically the richest silver mining district in Nevada.',
    overviewImage: '/assets/files/2213/drone_shot.png',
    overviewImageAlt: 'Aerial view of the Candelaria open pit and surrounding workings, Nevada',
    overviewCaption: 'The Candelaria property, central-west Nevada.',
    bandImage: '/assets/files/1/home-pg-sunset-v3.jpg',
    bandImageAlt: 'Silver One drilling at the Candelaria Project at sunset',
    bandTitle: 'Significant Exploration Potential',
    bandBody:
      'Mineralisation at Candelaria remains open down-dip and along strike, and continued drilling could identify additional zones.',
    bandAction: 'View Technical Reports',
    bandHref: '/projects/usa-projects/candelaria/#technical-reports',
  },

  cherokee: {
    location: 'Lincoln County, Nevada, USA',
    commodity: 'Silver (Ag), Copper (Cu), Gold (Au)',
    projectType: 'Epithermal vein district',
    status: 'Exploration · drill targets defined',
    overview:
      'Cherokee is an emerging epithermal silver, gold and copper district roughly 75 kilometres south of the historic Pioche mining camp. Silver One&rsquo;s 5,298-hectare (52 km²) property covers a 12-kilometre long by 4-kilometre wide structurally controlled silver-copper-gold system hosted by Paleozoic sediments.',
    overviewImage: '/assets/files/2560/cherokee_geophysics_draft_july2022.jpg',
    overviewImageAlt: 'Total Magnetic Intensity geophysical survey map of the Cherokee project, Nevada',
    overviewCaption: 'Total Magnetic Intensity — Cherokee Project.',
    bandImage: '/assets/files/2394/20180326_132542.jpg',
    bandImageAlt: 'Silver One geologists sampling outcrop on the Cherokee property, Nevada',
    bandTitle: 'A District-Scale Target',
    bandBody:
      'Several targets outside the patented claims remain untested, including the gold-silver rich Johnnie Mine and Hidden Treasure vein systems.',
    bandAction: 'View Maps & Photographs',
    bandHref: '/projects/usa-projects/cherokee/#maps',
  },

  silver_phoenix: {
    location: 'Near Globe, Arizona, USA',
    commodity: 'Native silver (Ag), Copper (Cu)',
    projectType: 'High-grade vein prospect',
    status: 'Early-stage exploration · drill permitted',
    overview:
      'The Phoenix Silver Project lies within the &ldquo;Arizona Silver Belt&rdquo;, on the margins of the prolific copper producing area near Globe, Arizona, where BHP, Rio Tinto and Freeport-McMoRan all operate producing mines. Native silver and other silver-bearing minerals characterise the deposits of the belt.',
    overviewImage: '/assets/files/2478/2023-03-02-sve-nrp1.jpg',
    overviewImageAlt:
      '417 pound vein fragment from the Phoenix Silver Project containing an estimated 70% native silver',
    // Caption transcribed from the project gallery on silverone.com.
    overviewCaption:
      '417 pound vein fragment containing estimated 70% silver (determined by specific gravity method). The photo is of a selected sample that is not necessarily representative of the mineralization hosted on the property.',
    bandImage: '/assets/files/2478/picture2_figure_1.jpg',
    bandImageAlt: 'Adit exposing a quartz-manganese vein on the Phoenix Silver property, Arizona',
    bandTitle: 'High-Grade Native Silver',
    bandBody:
      'One 8.5 kg sample assayed 459,000 g/t silver — approximately 46% Ag — by concentrate sampling at Skyline Assayers and Laboratories, Tucson.',
    bandAction: 'View Exploration Results',
    bandHref: '/projects/usa-projects/silver_phoenix/#recent-exploration',
  },
};

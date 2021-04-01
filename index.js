import express from 'express';
import cors from 'cors';
import { uniqueCount } from './lib/utils';
import { getInstagramCount, getTwitterCount } from './lib/scraper';
import db from './lib/db';
import './lib/cron';
import aggregate from './lib/aggregate';

const app = express();
app.use(cors());

app.get(`/scrape`, async (req, res, next) => {
  console.log(`Scraping!!`);
  const [iCount] = await Promise.all([
    getInstagramCount()
    
  ]);
  res.json({ iCount});
});

app.get(`/data`, async (req, res, next) => {
  // get the scrape data
  const { twitter, instagram } = db.value();
  // filter for only unique values
  const unqiueTwitter = uniqueCount(twitter);
  const uniqueInstagram = uniqueCount(instagram);
  // respond with json
  res.json({ twitter: unqiueTwitter, instagram: uniqueInstagram });
});

app.get(`/aggregate`, async (req, res, next) => {
  // get the scrape data
  const { twitter, instagram } = db.value();
  // filter for only unique values
  const unqiueTwitter = uniqueCount(twitter);
  const uniqueInstagram = uniqueCount(instagram);
  // need to aggregate these values.
  // respond with json
  res.json({ twitter: aggregate(twitter), instagram: aggregate(instagram) });
});

// app.listen(2093, () => {
//   console.log(`Example App running on port http://localhost:2093`);
// });


const PORT = process.env.PORT || 2093;

app.listen(PORT, () => console.log(`Server staretd at port ${PORT}`));

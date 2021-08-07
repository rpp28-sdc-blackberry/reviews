const { check, sleep } = require('k6');
const http = require('k6/http');
const { Rate } = require('k6/metrics');

export const errorRate = new Rate('PUT /reviews/id/helpful error rate');

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1100,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 100, // how large the initial pool of VUs would be
      maxVUs: 1300, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {
  const url = 'http://localhost:3000/reviews/1000000/helpful';

  check(http.put(url), {
    'status is 204': (r) => r.status == 204,
  }) || errorRate.add(1);
  sleep(1);
}
